package com.volunteer.repository;

import com.volunteer.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByName(String name);

    List<Skill> findByCategory(String category);

    @Query("SELECT s FROM Skill s WHERE s.category = :category ORDER BY s.name ASC")
    List<Skill> findByCategoryOrderByName(@Param("category") String category);

    boolean existsByName(String name);
}
