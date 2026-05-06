package com.example.backend.service;

import com.example.backend.entity.Policy;
import com.example.backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PolicyExcelImportService {

    private final PolicyRepository policyRepository;
    private final NotificationService notificationService;

    public void importExcel(InputStream inputStream) {
        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);

            Row headerRow = sheet.getRow(0);
            Map<String, Integer> headers = getHeaders(headerRow);

            Set<String> excelPolicyNos = new HashSet<>();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                String policyNo = getCell(row, headers, "정책번호");
                String title = getCell(row, headers, "정책명");

                if (policyNo == null || policyNo.isBlank()) {
                    continue;
                }

                if (title == null || title.isBlank()) {
                    continue;
                }

                excelPolicyNos.add(policyNo);

                boolean isNewPolicy = !policyRepository.existsByPolicyNo(policyNo);

                Policy policy = policyRepository.findByPolicyNo(policyNo)
                        .orElse(new Policy());

                policy.setPolicyNo(policyNo);
                policy.setTitle(title);
                policy.setCategory(getCell(row, headers, "정책중분류명"));
                policy.setKeywords(getCell(row, headers, "정책키워드명"));

                policy.setDescription(getCell(row, headers, "정책설명내용"));
                policy.setSupportContent(getCell(row, headers, "정책지원내용"));

                policy.setApplyStartDate(getCell(row, headers, "신청시작일자"));
                policy.setApplyEndDate(getCell(row, headers, "신청마감일자"));

                policy.setBusinessStartDate(getCell(row, headers, "사업기간시작일자"));
                policy.setBusinessEndDate(getCell(row, headers, "사업기간종료일자"));
                policy.setBusinessPeriodText(getCell(row, headers, "사업기간기타내용"));

                policy.setRegion(getCell(row, headers, "거주지역"));
                policy.setIncomeCondition(getCell(row, headers, "소득내용"));
                policy.setMarriageStatus(getCell(row, headers, "결혼상태"));

                policy.setMinAge(getIntCell(row, headers, "지원대상최소연령"));
                policy.setMaxAge(getIntCell(row, headers, "지원대상최대연령"));

                policy.setEmploymentCondition(getCell(row, headers, "정책취업요건"));
                policy.setEducationCondition(getCell(row, headers, "정책학력요건"));
                policy.setMajorCondition(getCell(row, headers, "정책전공요건"));
                policy.setSpecialCondition(getCell(row, headers, "정책특화요건"));

                policy.setExtraCondition(getCell(row, headers, "추가신청자격조건내용"));
                policy.setRestriction(getCell(row, headers, "참여제한대상내용"));

                policy.setApplyMethod(getCell(row, headers, "정책신청방법내용"));
                policy.setScreeningMethod(getCell(row, headers, "심사방법내용"));

                policy.setApplyUrl(getCell(row, headers, "신청URL주소"));
                policy.setNote(getCell(row, headers, "기타사항내용"));
                policy.setReferenceUrl1(getCell(row, headers, "참고URL주소1"));
                policy.setReferenceUrl2(getCell(row, headers, "참고URL주소2"));

                if (policy.getViews() == null) {
                    policy.setViews(0);
                }

                policy.setActive(true);

                Policy savedPolicy = policyRepository.save(policy);

                if (isNewPolicy) {
                    notificationService.createNewPolicyNotification(savedPolicy);
                    System.out.println("✅ 새 정책 저장 + 알림 생성: " + savedPolicy.getTitle());
                }
            }

            for (Policy savedPolicy : policyRepository.findAll()) {
                if (!excelPolicyNos.contains(savedPolicy.getPolicyNo())) {
                    savedPolicy.setActive(false);
                    policyRepository.save(savedPolicy);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("엑셀 정책 데이터 import 실패", e);
        }
    }

    private Map<String, Integer> getHeaders(Row headerRow) {
        Map<String, Integer> headers = new HashMap<>();
        DataFormatter formatter = new DataFormatter();

        for (Cell cell : headerRow) {
            String headerName = formatter.formatCellValue(cell).trim();
            headers.put(headerName, cell.getColumnIndex());
        }

        return headers;
    }

    private String getCell(Row row, Map<String, Integer> headers, String columnName) {
        Integer index = headers.get(columnName);
        if (index == null) {
            return "";
        }

        Cell cell = row.getCell(index);
        if (cell == null) {
            return "";
        }

        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }

    private Integer getIntCell(Row row, Map<String, Integer> headers, String columnName) {
        try {
            String value = getCell(row, headers, columnName);

            if (value == null || value.isBlank()) {
                return null;
            }

            value = value.replaceAll("[^0-9]", "");

            if (value.isBlank()) {
                return null;
            }

            return Integer.parseInt(value);
        } catch (Exception e) {
            return null;
        }
    }
}