import { useState } from 'react'
import styles from './styles.module.css'

interface WordData {
  number: number
  word: string
  frequency: number
  difficulty_score: number
  translation: string
}

interface SortConfig {
  key: keyof WordData | null
  direction: 'asc' | 'desc'
}

export default function SortableTable({ data: initialData }: { data: WordData[] }) {
  const [data, setData] = useState<WordData[]>(initialData)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  })

  const handleSort = (key: keyof WordData) => {
    if (key === 'translation' || key === 'number') return

    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const sortedData = [...data].sort((a, b) => {
      if (key === 'word') {
        return direction === 'asc' 
          ? a.word.localeCompare(b.word)
          : b.word.localeCompare(a.word)
      }
      if (key === 'frequency') {
        return direction === 'asc'
          ? a.frequency - b.frequency
          : b.frequency - a.frequency
      }
      if (key === 'difficulty_score') {
        return direction === 'asc'
          ? a.difficulty_score - b.difficulty_score
          : b.difficulty_score - a.difficulty_score
      }
      return 0
    })

    setData(sortedData)
    setSortConfig({ key, direction })
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    } else {
      console.log('浏览器不支持语音合成')
    }
  }

  // 将难度分数格式化为整数
  const formatDifficultyScore = (score: number): string => {
    return Math.round(score).toString()
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>序号</th>
          <th>
            <button className={styles.sortButton} onClick={() => handleSort('word')}>
              单词 {sortConfig.key === 'word' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </th>
          <th>
            <button className={styles.sortButton} onClick={() => handleSort('frequency')}>
              频率 {sortConfig.key === 'frequency' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </th>
          <th>
            <button className={styles.sortButton} onClick={() => handleSort('difficulty_score')}>
              难度分数 {sortConfig.key === 'difficulty_score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </th>
          <th>中文翻译</th>
          <th>发音</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.number}>
            <td>{item.number}</td>
            <td>{item.word}</td>
            <td>{item.frequency}</td>
            <td>{formatDifficultyScore(item.difficulty_score)}</td>
            <td>{item.translation}</td>
            <td>
              <button 
                className={styles.audioButton}
                onClick={() => speak(item.word)}
                aria-label={`Listen to ${item.word}`}
              >
                🔊
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}