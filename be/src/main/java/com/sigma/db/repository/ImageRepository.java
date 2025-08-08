package com.sigma.db.repository;

import com.sigma.db.entity.Image;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findAllByCreatedAt(LocalDate date);

	Optional<Image> findByFilename(String filename);
}
