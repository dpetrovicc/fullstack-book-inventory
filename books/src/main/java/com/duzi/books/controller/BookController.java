package com.duzi.books.controller;

import com.duzi.books.dto.BookRequestDto;
import com.duzi.books.model.Author;
import com.duzi.books.model.Category;
import com.duzi.books.model.Book;
import com.duzi.books.repository.AuthorRepository;
import com.duzi.books.repository.CategoryRepository;
import com.duzi.books.repository.BookRepository;
import com.duzi.books.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
//MENADZER SALE, SEF PROZORA ZA NARUCIVANJE
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        List<Book> books;

        if (search != null && !search.isEmpty()) {
            books = bookRepository.findByTitleContainingIgnoreCase(search);
        } else if (sortBy != null && (sortBy.equals("year") || sortBy.equals("price"))) {
            books = bookRepository.findAll();

            books.sort((b1, b2) -> {
                Comparable val1 = sortBy.equals("year") ? b1.getYear() : b1.getPrice();
                Comparable val2 = sortBy.equals("year") ? b2.getYear() : b2.getPrice();
                int comparison = val1.compareTo(val2);
                return sortDir.equalsIgnoreCase("asc") ? comparison : -comparison;
            });

        } else {
            books = bookRepository.findAll();
        }

        return books;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book createBook(@RequestBody BookRequestDto bookDto) {
        return bookService.createNewBook(bookDto);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequestDto bookDto) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDto);
            return ResponseEntity.ok(updatedBook);

        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }




    @GetMapping("/authors")
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }


    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
