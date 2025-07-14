package com.sigma.db.repository;

import com.sigma.db.entity.User;
import jakarta.validation.constraints.NotBlank;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserId(@NotBlank String userId);

    boolean existsByUserId(@NotBlank String userId);
}
