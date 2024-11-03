// src/components/KnowledgeCard/index.jsx
import React, { useState } from 'react';
import styles from './styles.module.css';

const KnowledgeCard = ({
  title,
  category,
  frequency,
  relatedConcepts,
  definition,
  keyFeatures,
  principles,
  formulas,
  typicalQuestions,
  solvingSteps,
  commonMistakes,
  calculations,
  timeline,
  keyFigures,
  charts,
  reviewTips
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.title}>{title}</div>
          <span className={styles.category}>{category}</span>
          <span className={styles.frequency}>考察频率: {frequency}</span>
        </div>
        <div className={styles.relatedConcepts}>
          <span>相关知识点: {relatedConcepts.join(', ')}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.basicInfo}>
          <div className={styles.sectionTitle}>基本概念</div>
          <p>{definition}</p>
        </div>

        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '收起详情' : '展开详情'}
        </button>

        {isExpanded && (
          <div className={styles.details}>
            <div className={styles.theoreticalSection}>
              <div className={styles.sectionTitle}>理论要点</div>
              <ul className={styles.keyFeatures}>
                {keyFeatures.map((feature, index) => (
                  <li key={index} className={styles.listItem}>{feature}</li>
                ))}
              </ul>
              <div className={styles.principles}>
                <div className={styles.subSectionTitle}>基本原理</div>
                <p>{principles}</p>
              </div>
              {formulas && (
                <div className={styles.formulas}>
                  <div className={styles.subSectionTitle}>重要公式</div>
                  <code>{formulas}</code>
                </div>
              )}
            </div>

            <div className={styles.practicalSection}>
              <div className={styles.sectionTitle}>应用要点</div>
              <div className={styles.questions}>
                <div className={styles.subSectionTitle}>典型题型</div>
                <p>{typicalQuestions}</p>
              </div>
              <div className={styles.steps}>
                <div className={styles.subSectionTitle}>解题步骤</div>
                <ol>
                  {solvingSteps.map((step, index) => (
                    <li key={index} className={styles.listItem}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className={styles.mistakes}>
                <div className={styles.subSectionTitle}>常见错误</div>
                <ul>
                  {commonMistakes.map((mistake, index) => (
                    <li key={index} className={styles.listItem}>{mistake}</li>
                  ))}
                </ul>
              </div>
              {calculations && (
                <div className={styles.calculations}>
                  <div className={styles.subSectionTitle}>计算方法</div>
                  <p>{calculations}</p>
                </div>
              )}
            </div>

            {timeline && (
              <div className={styles.historySection}>
                <div className={styles.sectionTitle}>历史发展</div>
                <div className={styles.timeline}>
                  {timeline.map((event, index) => (
                    <div key={index} className={styles.timelineEvent}>
                      <span className={styles.timelineDate}>{event.date}</span>
                      <span className={styles.timelineContent}>{event.content}</span>
                    </div>
                  ))}
                </div>
                {keyFigures && (
                  <div className={styles.keyFigures}>
                    <div className={styles.subSectionTitle}>重要人物</div>
                    <ul>
                      {keyFigures.map((figure, index) => (
                        <li key={index} className={styles.listItem}>{figure}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {charts && (
              <div className={styles.chartSection}>
                <div className={styles.sectionTitle}>图表分析</div>
                <div className={styles.chartContent}>
                  {charts}
                </div>
              </div>
            )}

            <div className={styles.reviewSection}>
              <div className={styles.sectionTitle}>复习提示</div>
              <ul>
                {reviewTips.map((tip, index) => (
                  <li key={index} className={styles.listItem}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeCard;	