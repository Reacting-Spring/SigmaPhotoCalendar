package com.sigma.sigmacalendar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sigma.sigmacalendar.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
    Optional<User> findByUserId(String userId);
}
