import React, { useEffect, useState } from 'react';
import { fetchTopics, fetchProgress, toggleProblem } from '../services/dsaService';
import Loader from '../components/Loader';
import styles from './Sheet.module.css';

function Sheet() {
  const [topics, setTopics] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all | todo | done
  const [openChapters, setOpenChapters] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [t, c] = await Promise.all([fetchTopics(), fetchProgress()]);
        setTopics(t);
        setCompleted(c);
        // Open all chapters by default
        const open = {};
        t.forEach((ch) => { open[ch.id] = true; });
        setOpenChapters(open);
      } catch (err) {
        setError('Failed to load problems. Please refresh.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Optimistic update — update UI first, then sync to server
  const handleToggle = async (problemId) => {
    setCompleted((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
    try {
      await toggleProblem(problemId);
    } catch (err) {
      // Revert on server error
      setCompleted((prev) =>
        prev.includes(problemId)
          ? prev.filter((id) => id !== problemId)
          : [...prev, problemId]
      );
      console.error('Failed to save progress:', err);
    }
  };

  const toggleChapter = (id) => {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <Loader text="Loading problems..." />;
  if (error) return <div className={styles.errorMsg}>{error}</div>;

  const allProblems = topics.flatMap((t) => t.problems);
  const totalDone = completed.length;
  const total = allProblems.length;
  const pct = total ? Math.round((totalDone / total) * 100) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Progress banner */}
        <div className={styles.progressBanner}>
          <div className={styles.progStats}>
            <span className={styles.progDone}>{totalDone}</span>
            <span className={styles.progLabel}>solved of {total}</span>
            <span className={styles.divider}>|</span>
            <span className={styles.progEasy}>Easy: {allProblems.filter((p) => p.difficulty === 'Easy' && completed.includes(p.id)).length}/{allProblems.filter((p) => p.difficulty === 'Easy').length}</span>
            <span className={styles.progMed}>Medium: {allProblems.filter((p) => p.difficulty === 'Medium' && completed.includes(p.id)).length}/{allProblems.filter((p) => p.difficulty === 'Medium').length}</span>
            <span className={styles.progHard}>Hard: {allProblems.filter((p) => p.difficulty === 'Hard' && completed.includes(p.id)).length}/{allProblems.filter((p) => p.difficulty === 'Hard').length}</span>
          </div>
          <div className={styles.progTrack}>
            <div className={styles.progFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.filterGroup}>
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                className={`${styles.fBtn} ${diffFilter === d ? styles.fActive : ''} ${diffFilter === d ? styles['f' + d] : ''}`}
                onClick={() => setDiffFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <button className={`${styles.fBtn} ${statusFilter === 'all' ? styles.fActive : ''}`} onClick={() => setStatusFilter('all')}>All</button>
            <button className={`${styles.fBtn} ${statusFilter === 'todo' ? styles.fActive : ''}`} onClick={() => setStatusFilter('todo')}>To Do</button>
            <button className={`${styles.fBtn} ${statusFilter === 'done' ? styles.fActive : ''}`} onClick={() => setStatusFilter('done')}>Done</button>
          </div>
        </div>

        {/* Chapters */}
        {topics.map((topic) => {
          let problems = topic.problems;
          if (search) problems = problems.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
          if (diffFilter !== 'All') problems = problems.filter((p) => p.difficulty === diffFilter);
          if (statusFilter === 'done') problems = problems.filter((p) => completed.includes(p.id));
          if (statusFilter === 'todo') problems = problems.filter((p) => !completed.includes(p.id));
          if (!problems.length) return null;

          const done = topic.problems.filter((p) => completed.includes(p.id)).length;
          const total = topic.problems.length;
          const tp = total ? Math.round((done / total) * 100) : 0;
          const isOpen = openChapters[topic.id];

          return (
            <div className={styles.chapter} key={topic.id}>
              <div className={styles.chHead} onClick={() => toggleChapter(topic.id)}>
                <div className={styles.chMeta}>
                  <span className={styles.chName}>{topic.name}</span>
                  <span className={styles.chSub}>{total} problems &middot; {done} solved</span>
                </div>
                <div className={styles.chRight}>
                  <div className={styles.chBar}>
                    <div className={styles.chFill} style={{ width: `${tp}%` }} />
                  </div>
                  <span className={styles.chPct}>{tp}%</span>
                  <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>&#9662;</span>
                </div>
              </div>

              {isOpen && (
                <div className={styles.chBody}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th style={{ width: 44 }}>Done</th>
                        <th>Problem</th>
                        <th style={{ width: 90 }}>Level</th>
                        <th style={{ width: 210 }}>Resources</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problems.map((p, i) => {
                        const isDone = completed.includes(p.id);
                        return (
                          <tr key={p.id} className={isDone ? styles.done : ''}>
                            <td className={styles.num}>{String(i + 1).padStart(2, '0')}</td>
                            <td>
                              <div
                                className={`${styles.checkbox} ${isDone ? styles.checked : ''}`}
                                onClick={() => handleToggle(p.id)}
                              />
                            </td>
                            <td className={isDone ? styles.strikethrough : styles.probName}>
                              {p.name}
                            </td>
                            <td>
                              <span className={`${styles.badge} ${styles[p.difficulty.toLowerCase()]}`}>
                                {p.difficulty}
                              </span>
                            </td>
                            <td>
                              <div className={styles.links}>
                                <a href={p.youtube} target="_blank" rel="noreferrer" className={`${styles.link} ${styles.yt}`}>&#9654; YouTube</a>
                                <a href={p.leetcode} target="_blank" rel="noreferrer" className={`${styles.link} ${styles.lc}`}>LC</a>
                                <a href={p.article} target="_blank" rel="noreferrer" className={`${styles.link} ${styles.art}`}>&#128196;</a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {topics.every((topic) => {
          let problems = topic.problems;
          if (search) problems = problems.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
          if (diffFilter !== 'All') problems = problems.filter((p) => p.difficulty === diffFilter);
          if (statusFilter === 'done') problems = problems.filter((p) => completed.includes(p.id));
          if (statusFilter === 'todo') problems = problems.filter((p) => !completed.includes(p.id));
          return problems.length === 0;
        }) && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>&#128269;</div>
            <div className={styles.emptyTitle}>No problems found</div>
            <p>Try adjusting your search or filter</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Sheet;
