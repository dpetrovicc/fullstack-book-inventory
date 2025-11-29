import axios from 'axios';

//KONOBAR

// API_BASE_URL se odnosi na endpoint za KNJIGE (/api/books)
const API_BASE_URL = 'http://localhost:8080/api/books'; 

class BookService {
    
    // Dohvaćanje svih knjiga sa opcijama sortiranja i pretrage
    getAllBooks(sortBy = '', sortDir = 'asc', search = '') {
        let url = API_BASE_URL;
        const params = {};
        
        if (sortBy) params.sortBy = sortBy;
        if (sortDir) params.sortDir = sortDir;
        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        if (queryString) url = `${url}?${queryString}`;
        
        return axios.get(url);
    }

    // Kreiranje knjige
    createBook(bookDto) {
        return axios.post(API_BASE_URL, bookDto);
    }

    // Izmena knjige
    updateBook(bookId, bookDto) {
        return axios.put(`${API_BASE_URL}/${bookId}`, bookDto);
    }

    // Brisanje knjige
    deleteBook(bookId) {
        return axios.delete(`${API_BASE_URL}/${bookId}`);
    }

    // Dohvaćanje svih Autora
    // PUTANJA: /api/books/authors
    getAllAuthors() {
        return axios.get(`${API_BASE_URL}/authors`);
    }

    // Dohvaćanje svih Kategorija
    // PUTANJA: /api/books/categories
    getAllCategories() {
        return axios.get(`${API_BASE_URL}/categories`);
    }
}

export default new BookService();