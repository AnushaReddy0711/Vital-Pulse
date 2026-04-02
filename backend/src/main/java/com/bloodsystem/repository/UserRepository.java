package com.bloodsystem.repository;

import com.bloodsystem.entity.Role;
import com.bloodsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByCityIgnoreCase(String city);
    boolean existsByEmail(String email);
}
