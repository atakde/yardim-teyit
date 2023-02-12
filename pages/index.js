import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import fsPromises from 'fs/promises';
import path from 'path'
import { useEffect, useState } from 'react';
import { debounce } from '../helpers/utils';

export default function Home(props) {
  const { data } = props;
  const [tableData, setTableData] = useState(data);

  const handleSearch = (e) => {
    const value = e.target.value;
    const result = data.filter(item => item.url.includes(value));
    setTableData(result);
  };

  const handleSearchDebounce = debounce(handleSearch, 500);

  useEffect(() => {
    const searchInput = document.getElementById('#search');
    searchInput.addEventListener('input', handleSearchDebounce);
    return () => {
      searchInput.removeEventListener('input', handleSearchDebounce);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Yardım Teyit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles['search-container']}>
          <input type='text' id='#search' placeholder='Search...' />
          <button>Search</button>
        </div>
        <div className={styles['table-container']}>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index} className={item.status === 'FRAUD' ? 'fraud' : ''}>
                  <td><a href={item.status === "FRAUD" ? "#" : item.url} target='_blank'>{item.url}</a></td>
                  <td><span className={item.status === 'FRAUD' ? styles.status + ' fraud' : styles.status + ' secure' }>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer>
      </footer>
      <style jsx>{`
        .fraud {
          color: red;
        }
        .secure {
          color: green;
        }
      `}</style>
    </div>
  )
}

// inline styles


export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'json/data.json');
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData);

  return {
    props: objectData
  }
}
