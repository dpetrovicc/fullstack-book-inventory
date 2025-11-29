package com.duzi.books.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Set;
//PAPIR ZA NARUCIVANJE, STA SVE ZELI
@Data
public class BookRequestDto {

    private String title;
    private Integer year;
    private BigDecimal price;
    private Set<Long> authorIds;
    private Set<Long> categoryIds;
}