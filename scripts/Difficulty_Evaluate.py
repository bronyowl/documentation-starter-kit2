import pandas as pd
import nltk
from nltk.corpus import brown, cmudict
from collections import defaultdict
import math
import os
import re
from typing import Dict, Set

class ComprehensiveWordScorer:
    def __init__(self):
        # 下载必要的NLTK数据
        nltk.download('brown')
        nltk.download('cmudict')
        
        # 初始化CMU发音词典
        self.pronouncing_dict = cmudict.dict()
        
        # 计算词频
        self._init_word_frequencies()
        
        # 初始化音素复杂度评分规则
        self.complex_phonemes = set(['CH', 'JH', 'ZH', 'TH', 'DH', 'SH'])
        self.consonant_clusters = ['BL', 'BR', 'CL', 'CR', 'DR', 'FL', 'FR', 'GL', 'GR', 
                                 'PL', 'PR', 'SC', 'SK', 'SL', 'SM', 'SN', 'SP', 'ST', 
                                 'SW', 'TR', 'TW', 'SCR', 'SPL', 'SPR', 'STR']
    
    def _init_word_frequencies(self):
        """初始化词频统计"""
        self.word_freq = defaultdict(int)
        total_words = 0
        for word in brown.words():
            word = word.lower()
            self.word_freq[word] += 1
            total_words += 1
        
        self.word_freq = {word: count/total_words for word, count in self.word_freq.items()}
        self.max_freq = max(self.word_freq.values())
        self.min_freq = min(self.word_freq.values())

    def calculate_comprehensive_score(self, word: str) -> int:
        word = word.lower()
        
        # 1. 词频分数 (25%)
        frequency_score = self._get_frequency_score(word)
        
        # 2. 长度分数 (15%)
        length_score = self._get_length_score(word)
        
        # 3. 音素复杂度分数 (25%)
        phonetic_score = self._get_phonetic_complexity_score(word)
        
        # 4. 辅音群分数 (20%)
        consonant_score = self._get_consonant_cluster_score(word)
        
        # 5. 音节数分数 (15%)
        syllable_score = self._get_syllable_score(word)
        
        # 综合计算
        final_score = (
            frequency_score * 0.25 +
            length_score * 0.15 +
            phonetic_score * 0.25 +
            consonant_score * 0.20 +
            syllable_score * 0.15
        )
        
        # 确保分数在1-100范围内
        return max(1, min(100, round(final_score)))

    def _get_frequency_score(self, word: str) -> float:
        """基于词频的分数"""
        freq = self.word_freq.get(word, self.min_freq)
        if freq == 0:
            return 100
        log_freq = math.log(freq + 1e-10)
        log_max = math.log(self.max_freq + 1e-10)
        log_min = math.log(self.min_freq + 1e-10)
        return 100 * (1 - (log_freq - log_min) / (log_max - log_min))

    def _get_length_score(self, word: str) -> float:
        """基于单词长度的分数"""
        length = len(word)
        if length <= 3:
            return 20
        elif length <= 5:
            return 40
        elif length <= 7:
            return 60
        elif length <= 9:
            return 80
        else:
            return 100

    def _get_phonetic_complexity_score(self, word: str) -> float:
        """基于音素复杂度的分数"""
        if word not in self.pronouncing_dict:
            return 50  # 默认分数
        
        pronunciation = self.pronouncing_dict[word][0]
        complex_phoneme_count = sum(1 for phoneme in pronunciation if phoneme in self.complex_phonemes)
        
        # 根据复杂音素的数量计算分数
        return min(100, complex_phoneme_count * 25)

    def _get_consonant_cluster_score(self, word: str) -> float:
        """基于辅音群的分数"""
        word = word.upper()
        cluster_count = sum(1 for cluster in self.consonant_clusters if cluster in word)
        return min(100, cluster_count * 33)

    def _get_syllable_score(self, word: str) -> float:
        """基于音节数的分数"""
        if word not in self.pronouncing_dict:
            # 简单估算音节数
            return len(re.findall('[aeiou]+', word.lower())) * 20
        
        # 使用CMU词典计算音节数
        syllable_count = len([ph for ph in self.pronouncing_dict[word][0] if ph.strip('0123456789')])
        return min(100, syllable_count * 20)

def process_word_table(input_file: str, output_file: str):
    # 初始化评分器
    scorer = ComprehensiveWordScorer()
    
    # 读取现有的JS数据
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
        # 提取JSON部分
        json_str = content.split('export const tableData =')[1].strip()
        df = pd.read_json(json_str)
    
    # 计算综合难度分数
    df['difficulty_score'] = df['word'].apply(scorer.calculate_comprehensive_score)
    
    # 移除原有的level列
    if 'level' in df.columns:
        df = df.drop('level', axis=1)
    
    # 写入新的JS文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('export const tableData = ')
        f.write(df.to_json(orient='records', force_ascii=False, indent=2))

    print(f"处理完成，数据已保存到: {output_file}")

if __name__ == "__main__":
    input_path = r"D:\Documentation_site_build\documentation-starter-kit\components\SortableTable\tableData.js"
    output_path = r"D:\Documentation_site_build\documentation-starter-kit\components\SortableTable\tableData.js"
    process_word_table(input_path, output_path)