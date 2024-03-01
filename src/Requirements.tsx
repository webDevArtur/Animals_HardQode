import React, { useState, useEffect, ChangeEvent } from 'react';
import { requestAnimals, Animal, Query } from './api';
import './Requirements.css';

const AnimalList: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [filterAnimal, setFilterAnimal] = useState<string>('');
    const [filterAmount, setFilterAmount] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(4);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const params: Query = {
                    animal: filterAnimal,
                    amount: filterAmount,
                    limit: limit,
                    offset: (page - 1) * limit,
                };

                const result = await requestAnimals(params);
                setAnimals(result);
                setError('');
            } catch (error: any) {
                setError(error.toString());
                setAnimals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filterAnimal, filterAmount, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [filterAnimal, filterAmount]);

    const handleFilterAnimalChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterAnimal(event.target.value);
        setPage(1);
    };

    const handleFilterAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterAmount(event.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
    };


    return (
        <div className="animal-list-container">
            <div className="filter-section">
                <div className="filter-item">
                    <label htmlFor="filter-animal">Поиск животного:</label>
                    <input id="filter-animal" type="text" value={filterAnimal} onChange={handleFilterAnimalChange} />
                </div>
                <div className="filter-item">
                    <label htmlFor="filter-amount">Количество животных:</label>
                    <input id="filter-amount" type="text" value={filterAmount} onChange={handleFilterAmountChange} />
                </div>
            </div>

            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : animals.length === 0 ? (
                <div className="no-animals-message">Животных не найдено</div>
            ) : (
                <div className="animals">
                    <table className="animal-table">
                        <thead>
                        <tr>
                            <th>Животное</th>
                            <th>Количество</th>
                        </tr>
                        </thead>
                        <tbody>
                        {animals.map((animal, index) => (
                            <tr className="animal-row" key={index}>
                                <td>{animal.animal}</td>
                                <td>{animal.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination">
                <div className="pagination-buttons">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || loading}>Предыдущая</button>
                    <span className="page-number">Страница: {page}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={loading || (animals.length < limit)}>Следующая</button>

                </div>

                <div className="limit-selector">
                    <label htmlFor="limit-select">Элементов на странице: </label>
                    <select id="limit-select" value={limit} onChange={handleLimitChange} disabled={loading}>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default AnimalList;
