package com.volunteer.service;

import com.volunteer.dto.SkillDTO;
import com.volunteer.entity.Skill;
import com.volunteer.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillDTO createSkill(SkillDTO skillDTO) {
        if (skillRepository.existsByName(skillDTO.getName())) {
            throw new RuntimeException("Skill already exists");
        }

        Skill skill = Skill.builder()
                .name(skillDTO.getName())
                .description(skillDTO.getDescription())
                .category(skillDTO.getCategory())
                .build();

        Skill savedSkill = skillRepository.save(skill);
        return convertToDTO(savedSkill);
    }

    public SkillDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        return convertToDTO(skill);
    }

    public SkillDTO getSkillByName(String name) {
        Skill skill = skillRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        return convertToDTO(skill);
    }

    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SkillDTO> getSkillsByCategory(String category) {
        return skillRepository.findByCategoryOrderByName(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SkillDTO updateSkill(Long id, SkillDTO skillDTO) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skill.setDescription(skillDTO.getDescription());
        skill.setCategory(skillDTO.getCategory());

        Skill updatedSkill = skillRepository.save(skill);
        return convertToDTO(updatedSkill);
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    private SkillDTO convertToDTO(Skill skill) {
        return SkillDTO.builder()
                .id(skill.getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .category(skill.getCategory())
                .build();
    }
}
