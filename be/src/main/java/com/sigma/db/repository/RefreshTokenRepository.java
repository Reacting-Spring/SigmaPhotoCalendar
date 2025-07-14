package com.sigma.db.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sigma.db.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    void deleteByUserId(Long userId);

	void deleteByToken(String refreshToken);

	Optional<RefreshToken> findByToken(String token);
}
