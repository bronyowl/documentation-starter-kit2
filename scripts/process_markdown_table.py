import pandas as pd
from io import StringIO
import os

# 设置文件路径
input_path = r"D:\Documentation_site_build\documentation-starter-kit\pages\word_frequency_analysis.mdx"
output_dir = r"D:\Documentation_site_build\documentation-starter-kit\components\SortableTable"
output_file = "tableData.js"

# 确保输出目录存在
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, output_file)

# 读取markdown文件
with open(input_path, 'r', encoding='utf-8') as file:
    content = file.read()

# 提取表格部分
table_lines = []
capture = False
for line in content.split('\n'):
    if '|' in line:
        if ':-' in line:  # 跳过对齐行
            continue
        table_lines.append(line)

table_content = '\n'.join(table_lines)

# 使用pandas读取markdown表格
df = pd.read_table(StringIO(table_content), sep='|')

# 清理数据
df = df.iloc[:, 1:-1]  # 移除首尾空列
df.columns = ['number', 'word', 'frequency', 'level', 'translation']

# 转换数据类型
df['number'] = pd.to_numeric(df['number'], errors='coerce')
df['word'] = df['word'].astype('string')
df['frequency'] = pd.to_numeric(df['frequency'], errors='coerce')
df['level'] = df['level'].astype('string')
df['translation'] = df['translation'].astype('string')

# 清理每列中的空白字符
for col in ['word', 'level', 'translation']:
    df[col] = df[col].str.strip()

# 转换为JSON
json_data = df.to_json(orient='records', force_ascii=False, indent=2)

# 写入新文件
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('export const tableData = ' + json_data)

print(f"数据已成功转换并保存到: {output_path}")