package com.duzi.books.repository;

import com.duzi.books.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
//SKLADISTE, MAGACIONER
@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {}