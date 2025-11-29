package com.duzi.books.repository;

import com.duzi.books.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // NOVI IMPORT
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Override
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.authors a LEFT JOIN FETCH b.categories c")
    List<Book> findAll();

    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.authors a LEFT JOIN FETCH b.categories c WHERE b.id = :id")
    Optional<Book> findById(Long id);

    List<Book> findByTitleContainingIgnoreCase(String title);
}
