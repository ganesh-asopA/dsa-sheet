import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTopics, fetchProgress } from '../services/dsaService';
import { getUser } from '../services/authService';
import Loader from '../components/Loader';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    const load = async () => {
      try {
        const [t, c] = await Promise.all([fetchTopics(), fetchProgress()]);
        setTopics(t);
        setCompleted(c);
      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;
  if (error) return <div className={styles.error}>{error}</div>;

  const allProblems = topics.flatMap((t) => t.problems);
  const totalDone = completed.length;
  const total = allProblems.length;
  const pct = total ? Math.round((totalDone / total) * 100) : 0;

  const easyDone = allProblems.filter((p) => p.difficulty === 'Easy' && completed.includes(p.id)).length;
  const medDone  = allProblems.filter((p) => p.difficulty === 'Medium' && completed.includes(p.id)).length;
  const hardDone = allProblems.filter((p) => p.difficulty === 'Hard' && completed.includes(p.id)).length;
  const easyTotal = allProblems.filter((p) => p.difficulty === 'Easy').length;
  const medTotal  = allProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardTotal = allProblems.filter((p) => p.difficulty === 'Hard').length;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <div className={styles.welcome}>
          <h2>Welcome back, {user?.name} 👋</h2>
          <p>Keep grinding. Consistency beats talent every time.</p>
        </div>

        {/* Stats cards */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum} style={{ color: '#667eea' }}>{totalDone}</div>
            <div className={styles.statLabel}>Total Solved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum} style={{ color: '#16a34a' }}>{easyDone}</div>
            <div className={styles.statLabel}>Easy <span className={styles.statOf}>of {easyTotal}</span></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum} style={{ color: '#d97706' }}>{medDone}</div>
            <div className={styles.statLabel}>Medium <span className={styles.statOf}>of {medTotal}</span></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum} style={{ color: '#dc2626' }}>{hardDone}</div>
            <div className={styles.statLabel}>Hard <span className={styles.statOf}>of {hardTotal}</span></div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span>Overall Progress</span>
            <span className={styles.progressNums}>{totalDone} / {total} problems solved</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <div className={styles.progressPct}>{pct}% complete</div>
        </div>

        {/* Topic cards grid */}
        <h3 className={styles.sectionTitle}>Topics</h3>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => {
            const done = topic.problems.filter((p) => completed.includes(p.id)).length;
            const total = topic.problems.length;
            const tp = total ? Math.round((done / total) * 100) : 0;
            return (
              <Link to="/sheet" className={styles.topicCard} key={topic.id}>
                <div className={styles.topicName}>{topic.name}</div>
                <div className={styles.topicSub}>{done} / {total} solved</div>
                <div className={styles.topicBar}>
                  <div className={styles.topicFill} style={{ width: `${tp}%` }} />
                </div>
                <div className={styles.topicPct}>{tp}%</div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
