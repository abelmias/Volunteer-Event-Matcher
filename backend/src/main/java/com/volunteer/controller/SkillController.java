package com.volunteer.controller;

import com.volunteer.dto.SkillDTO;
import com.volunteer.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<?> createSkill(@Valid @RequestBody SkillDTO skillDTO) {
        try {
            SkillDTO createdSkill = skillService.createSkill(skillDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating skill: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSkillById(@PathVariable Long id) {
        try {
            SkillDTO skillDTO = skillService.getSkillById(id);
            return ResponseEntity.ok(skillDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getSkillByName(@PathVariable String name) {
        try {
            SkillDTO skillDTO = skillService.getSkillByName(name);
            return ResponseEntity.ok(skillDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSkills() {
        try {
            List<SkillDTO> skills = skillService.getAllSkills();
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getSkillsByCategory(@PathVariable String category) {
        try {
            List<SkillDTO> skills = skillService.getSkillsByCategory(category);
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDTO skillDTO) {
        try {
            SkillDTO updatedSkill = skillService.updateSkill(id, skillDTO);
            return ResponseEntity.ok(updatedSkill);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        try {
            skillService.deleteSkill(id);
            return ResponseEntity.ok("Skill deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
