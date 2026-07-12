package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.Roles;
import com.ProjectManagementApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();

    boolean existsByRole(Roles role);

}
