package com.duzi.books.service;

import com.duzi.books.dto.BookRequestDto;
import com.duzi.books.model.Book;
import com.duzi.books.model.Author;
import com.duzi.books.model.Category;
import com.duzi.books.repository.BookRepository;
import com.duzi.books.repository.AuthorRepository;
import com.duzi.books.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
//SEF KUHINJE
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    @Transactional
    public Book createNewBook(BookRequestDto dto) {

        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setYear(dto.getYear());
        book.setPrice(dto.getPrice());

        // Konvertuje Set<Long> u Set<Author>
        Set<Author> authors = dto.getAuthorIds().stream()
                .map(authorRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());

        // Konvertuje Set<Long> u Set<Category>
        Set<Category> categories = dto.getCategoryIds().stream()
                .map(categoryRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());

        book.setAuthors(authors);
        book.setCategories(categories);

        return bookRepository.save(book);
    }


    @Transactional
    public Book updateBook(Long id, BookRequestDto dto) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Knjiga sa ID " + id + " nije pronađena."));

        existingBook.setTitle(dto.getTitle());
        existingBook.setYear(dto.getYear());
        existingBook.setPrice(dto.getPrice());

        Set<Author> newAuthors = authorRepository.findAllById(dto.getAuthorIds()).stream().collect(Collectors.toSet());
        Set<Category> newCategories = categoryRepository.findAllById(dto.getCategoryIds()).stream().collect(Collectors.toSet());

        existingBook.getAuthors().clear();
        existingBook.getCategories().clear();

        existingBook.getAuthors().addAll(newAuthors);
        existingBook.getCategories().addAll(newCategories);

        return bookRepository.save(existingBook);
    }
}
