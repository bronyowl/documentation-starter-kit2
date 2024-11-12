import { useState } from 'react'
import styles from './styles.module.css'

interface WordData {
  number: number
  word: string
  frequency: number
  level: '中级' | '中高级'
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
    // 不对number和translation进行排序
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
      if (key === 'level') {
        return direction === 'asc'
          ? a.level.localeCompare(b.level)
          : b.level.localeCompare(a.level)
      }
      return 0
    })

    setData(sortedData)
    setSortConfig({ key, direction })
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
            <button className={styles.sortButton} onClick={() => handleSort('level')}>
              难度 {sortConfig.key === 'level' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </th>
          <th>中文翻译</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.number}>
            <td>{item.number}</td>
            <td>{item.word}</td>
            <td>{item.frequency}</td>
            <td>{item.level}</td>
            <td>{item.translation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}