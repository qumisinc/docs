#!/usr/bin/env bash
# rename_screenshots.sh
# Renames all Qumis screenshots in /images/screenshots using git mv

set -e

cd images/screenshots || {
  echo "❌ Directory /images/screenshots not found."
  exit 1
}

echo "🔄 Renaming screenshot files..."

# Home / Vault / Chats
git mv 01.jpeg home-dashboard.png
git mv 02.jpeg chats-overview.png
git mv 03.jpeg chats-ocr-processing.png
git mv 04.jpeg chats-policy-analysis.png
git mv 05.jpeg vault-my-documents.png
git mv 06.png vault-upload-files.png
git mv 07.jpeg vault-shared-documents.png

# Prompts
git mv 08.jpeg prompts-dashboard.png
git mv 09.jpeg prompts-create-prompt.png
git mv 10.jpeg prompts-edit-view.png
git mv 11.jpeg prompts-sample-edit.png
git mv 12.jpeg prompts-search-example.png
git mv 13.jpeg prompts-builders-risk-details.png
git mv 14.jpeg chats-select-saved-prompt.png

# Single Policy
git mv 15.jpeg single-policy-dashboard.png
git mv 16.jpeg single-policy-upload-document.png
git mv 17.jpeg single-policy-uploaded-documents.png
git mv 18.jpeg single-policy-additional-info.png
git mv 19.jpeg single-policy-generate-report.png
git mv 20.jpeg single-policy-report-results.png

# Comparisons
git mv 21.jpeg comparisons-dashboard.png
git mv 22.jpeg comparisons-upload-documents.png
git mv 23.jpeg comparisons-documents-added.png
git mv 24.jpeg comparisons-additional-info.png
git mv 25.jpeg comparisons-generate-report.png
git mv 26.jpeg comparisons-report-results.png
git mv 27.jpeg comparisons-visual-summary.png
git mv 28.jpeg comparisons-coverage-chart.png

# Contracts
git mv 29.jpeg contracts-dashboard.png
git mv 30.jpeg contracts-upload-documents.png
git mv 31.jpeg contracts-upload-insurance-docs.png
git mv 32.jpeg contracts-additional-info.png
git mv 33.jpeg contracts-generate-report.png
git mv 34.jpeg contracts-compliance-comparison.png

# Claims
git mv 35.jpeg claims-dashboard.png
git mv 36.jpeg claims-generate-report-step.png
git mv 37.jpeg claims-policy-documents.png
git mv 38.jpeg claims-fact-patterns.png
git mv 39.jpeg claims-additional-information.png
git mv 40.jpeg claims-final-report.png
git mv 41.jpeg claims-detailed-coverage-analysis.png

# Coverage Table (Beta)
git mv 42.jpeg coverage-table-dashboard.png
git mv 43.jpeg coverage-table-upload-documents.png
git mv 44.jpeg coverage-table-add-checklist-items.png
git mv 45.jpeg coverage-table-manual-entry.png
git mv 46.jpeg coverage-table-checklist-expanded.png
git mv 47.jpeg coverage-table-comparison-report.png

# Custom Report
git mv 48.jpeg custom-report-dashboard.png
git mv 49.jpeg custom-report-title.png
git mv 50.jpeg custom-report-upload-documents.png
git mv 51.jpeg custom-report-description.png
git mv 52.jpeg custom-report-template-example.png
git mv 53.jpeg custom-report-generated-output.png

echo "✅ All screenshot files renamed successfully!"