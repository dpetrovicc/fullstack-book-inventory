import React, { useState, useEffect } from 'react';
import BookService from '../services/BookService';

//TRPEZARIJA I MENI (BookForm)

// Funkcija za formatiranje imena autora
const formatAuthors = (authors) => {
    return authors && authors.length > 0
        ? authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')
        : 'Nema autora';
}

// Funkcija za formatiranje kategorija
const formatCategories = (categories) => {
    return categories && categories.length > 0
        ? categories.map(c => c.name).join(', ')
        : 'Nema kategorije';
}

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [sortDir, setSortDir] = useState('asc');
    const [search, setSearch] = useState('');
    const [isEditing, setIsEditing] = useState(false); 
    const [editingBook, setEditingBook] = useState(null);
    const [message, setMessage] = useState('');
    
    // Stanje za preuzete autore i kategorije
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    // logika za dohvat knjiga iz baze
    const fetchBooks = () => {
        BookService.getAllBooks(sortBy, sortDir, search)
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error("Greška pri preuzimanju knjiga:", error);
            });
    };
    
    // useEffect za dohvat autora i kategorija pri učitavanju
    useEffect(() => {
        // dohvati autore
        BookService.getAllAuthors()
            .then(response => setAuthors(response.data))
            .catch(error => console.error("Greška pri dohvaćanju autora:", error));

        // dohvati kategorije
        BookService.getAllCategories()
            .then(response => setCategories(response.data))
            .catch(error => console.error("Greška pri dohvaćanju kategorija:", error));

    }, []); // prazan niz [] osigurava da se ovo izvrši samo jednom

    useEffect(() => {
        fetchBooks();
    }, [sortBy, sortDir, search]); 
    
    

    // fja za otvaranje forme sa podacima knjige
    const handleEditClick = (book) => {
        const initialData = {
            id: book.id,
            title: book.title,
            year: book.year,
            price: book.price.toFixed(2),
            authorIds: book.authors ? book.authors.map(a => a.id) : [],
            categoryIds: book.categories ? book.categories.map(c => c.id) : [],
        };
        setEditingBook(initialData);
        setIsEditing(true); 
    };

    const handleDelete = (id) => {
        console.log(`Zahtev za brisanje knjige ID: ${id}.`); 
        
        BookService.deleteBook(id)
            .then(() => {
                fetchBooks();
                setMessage(`Knjiga ID ${id} uspešno obrisana.`);
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(error => console.error("Greška pri brisanju:", error));
    };
    
    // soritranje
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };
    
    // kada se forma popuni i sačuva, pozove se ova funkcija da osveži listu i postavi poruku
    const handleFormSubmit = (successMessage) => {
        fetchBooks();
        setIsEditing(false); 
        setEditingBook(null);
        setMessage(successMessage);
        
        // poruka da je uspesno sacuvana nestaje nakon 3 sekunde
        setTimeout(() => setMessage(''), 3000); 
    }

    const handleCancel = () => {
        setIsEditing(false);
        setEditingBook(null);
    }

    return (
        <div style={{ padding: '20px' }}>
            
            {/* prikaz poruke korisniku */}
            {message && (
                <div style={{ 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    padding: '10px', 
                    marginBottom: '15px', 
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}
            
            <h1>Sistem za Arhiviranje Knjiga</h1>
            
            {/* search polje */}
            <input 
                type="text" 
                placeholder="Pretraži po naslovu..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                style={{ padding: '10px', width: '300px', marginRight: '20px' }}
            />
            
            {/* dugme nova knjiga */}
            <button onClick={() => { setIsEditing(true); setEditingBook(null); }} style={{ padding: '10px' }}>
                + Nova Knjiga
            </button>
            
            <hr />

            {/* forma za Kreiranje/Izmenu */}
            {/* proveravamo da li su autori i kategorije učitani pre nego što renderujemo formu */}
            {isEditing && authors.length > 0 && categories.length > 0 && (
                <BookForm 
                    authors={authors} 
                    categories={categories}
                    initialData={editingBook}
                    onSubmitSuccess={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}
            {/* loading poruka prilikom ucitavanja iz baze */}
            {isEditing && (authors.length === 0 || categories.length === 0) && (
                <div>Učitavanje autora i kategorija...</div>
            )}
            
            <hr />

            {/* tabela knjiga */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>Naslov</th>
                        <th style={tableHeaderStyle} onClick={() => handleSort('year')} className="sortable-header">
                            Godina {sortBy === 'year' && (sortDir === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={tableHeaderStyle} onClick={() => handleSort('price')} className="sortable-header">
                            Cena {sortBy === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={tableHeaderStyle}>Autor(i)</th>
                        <th style={tableHeaderStyle}>Kategorija(e)</th>
                        <th style={tableHeaderStyle}>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td style={tableCellStyle}>{book.title}</td>
                            <td style={tableCellStyle}>{book.year}</td>
                            <td style={tableCellStyle}>{book.price.toFixed(2)} €</td>
                            <td style={tableCellStyle}>{formatAuthors(book.authors)}</td>
                            <td style={tableCellStyle}>{formatCategories(book.categories)}</td>
                            <td style={tableCellStyle}>
                                <button onClick={() => handleEditClick(book)}>Izmeni</button>
                                <button onClick={() => handleDelete(book.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                                    Obriši
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

//  stilizovanje tabele
const tableHeaderStyle = { border: '1px solid #ddd', padding: '12px', cursor: 'pointer' };
const tableCellStyle = { border: '1px solid #ddd', padding: '10px' };

// book forma

const BookForm = ({ authors, categories, onSubmitSuccess, initialData, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '', year: '', price: '', authorIds: [], categoryIds: []
    });

    useEffect(() => {
        setFormData(initialData || {
            title: '', year: '', price: '', authorIds: [], categoryIds: []
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'authorIds' || name === 'categoryIds') {
            const selectedValues = Array.from(options)
                .filter(option => option.selected)
                .map(option => parseInt(option.value));
            setFormData(prev => ({ ...prev, [name]: selectedValues }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    //logika kada se klikne Sacuvaj dugme
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isUpdate = !!formData.id; //ako je id null, znaci da je kreiranje, inace azuriranje
        
        //kreiranje dto objekta koji se salje backendu
        const bookDto = {
            title: formData.title,
            year: parseInt(formData.year),
            price: parseFloat(formData.price),
            authorIds: formData.authorIds,
            categoryIds: formData.categoryIds
        };
        
        //proverava da li je potrebno update ili create da se izvrsi
        const serviceCall = isUpdate
            ? BookService.updateBook(formData.id, bookDto)
            : BookService.createBook(bookDto);

        //povratna poruka koja se treba prikazati
        const successMessage = isUpdate
            ? 'Knjiga je uspesno promenjena!'
            : 'Knjiga uspešno kreirana!';
        
        serviceCall
            .then(() => {
                //fja za osvezavanje tabele
                onSubmitSuccess(successMessage); 
            })
            .catch(error => {
                console.error("Greška pri operaciji nad knjigom:", error.response || error);
                console.log('Greška pri operaciji nad knjigom. Proveri konzolu.');
            });
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h3>{formData.id ? 'Uredi Knjigu' : 'Kreiraj Novu Knjigu'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* kolone sa podacima za naslov, godinu i cenu */}
                <div>
                    <label>Naslov:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    <label>Godina:</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                    <label>Cena (€):</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                
                {/* kolone za dodavanje autora i kategorije za knjigu */}
                <div>
                    <label>Autor(i): (Drži CTRL za više)</label>
                    <select multiple name="authorIds" onChange={handleChange} value={formData.authorIds.map(String)} required>
                        {authors.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.firstName} {a.lastName}
                            </option>
                        ))}
                    </select>

                    <label>Kategorija(e): (Drži CTRL za više)</label>
                    <select multiple name="categoryIds" onChange={handleChange} value={formData.categoryIds.map(String)} required>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ gridColumn: '1 / span 2', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="submit" style={{ padding: '10px', backgroundColor: 'green', color: 'white', flexGrow: 1, marginRight: '10px' }}>
                        {formData.id ? 'Sačuvaj Promene' : 'Sačuvaj Knjigu'}
                    </button>
                    <button type="button" onClick={onCancel} style={{ padding: '10px', backgroundColor: '#ccc', color: 'black', flexGrow: 1 }}>
                        Odustani
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookList;