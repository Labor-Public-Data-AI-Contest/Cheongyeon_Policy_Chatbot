package com.example.backend.config;

import com.example.backend.service.PolicyExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PolicyDataLoader implements CommandLineRunner {

    private final PolicyExcelImportService policyExcelImportService;

    @Override
    public void run(String... args) throws Exception {
        ClassPathResource resource = new ClassPathResource("data/policy_final_data.xlsx");

        if (resource.exists()) {
            policyExcelImportService.importExcel(resource.getInputStream());
            System.out.println("정책 엑셀 데이터 import 완료");
        }
    }
}