#!/usr/bin/env bash
# copy_screenshot_slugs_verbose.sh
# Copies Qumis screenshots to new descriptive filenames under /images/screenshots
# with verbose logging and basic error handling

set -e

TARGET_DIR="images/screenshots"

cd "$TARGET_DIR" || {
  echo "❌ Directory $TARGET_DIR not found."
  exit 1
}

echo "📸 Starting screenshot copy & rename process..."
echo "------------------------------------------------------------"

copy_file() {
  local src="$1"
  local dest="$2"
  if [[ -f "$src" ]]; then
    cp "$src" "$dest"
    echo "✅ Copied $src → $dest"
  else
    echo "⚠️  Skipped $src (file not found)"
  fi
}

# Home / Vault / Chats
copy_file 01.png home-dashboard.png
copy_file 02.png chats-overview.png
copy_file 03.png chats-ocr-processing.png
copy_file 04.png chats-policy-analysis.png
copy_file 05.png vault-my-documents.png
copy_file 06.png vault-upload-files.png
copy_file 07.png vault-shared-documents.png

# Prompts
copy_file 08.png prompts-dashboard.png
copy_file 09.png prompts-create-prompt.png
copy_file 10.png prompts-edit-view.png
copy_file 11.png prompts-sample-edit.png
copy_file 12.png prompts-search-example.png
copy_file 13.png prompts-builders-risk-details.png
copy_file 14.png chats-select-saved-prompt.png

# Single Policy
copy_file 15.png single-policy-dashboard.png
copy_file 16.png single-policy-upload-document.png
copy_file 17.png single-policy-uploaded-documents.png
copy_file 18.png single-policy-additional-info.png
copy_file 19.png single-policy-generate-report.png
copy_file 20.png single-policy-report-results.png

# Comparisons
copy_file 21.png comparisons-dashboard.png
copy_file 22.png comparisons-upload-documents.png
copy_file 23.png comparisons-documents-added.png
copy_file 24.png comparisons-additional-info.png
copy_file 25.png comparisons-generate-report.png
copy_file 26.png comparisons-report-results.png
copy_file 27.png comparisons-visual-summary.png
copy_file 28.png comparisons-coverage-chart.png

# Contracts
copy_file 29.png contracts-dashboard.png
copy_file 30.png contracts-upload-documents.png
copy_file 31.png contracts-upload-insurance-docs.png
copy_file 32.png contracts-additional-info.png
copy_file 33.png contracts-generate-report.png
copy_file 34.png contracts-compliance-comparison.png

# Claims
copy_file 35.png claims-dashboard.png
copy_file 36.png claims-generate-report-step.png
copy_file 37.png claims-policy-documents.png
copy_file 38.png claims-fact-patterns.png
copy_file 39.png claims-additional-information.png
copy_file 40.png claims-final-report.png
copy_file 41.png claims-detailed-coverage-analysis.png

# Coverage Table (Beta)
copy_file 42.png coverage-table-dashboard.png
copy_file 43.png coverage-table-upload-documents.png
copy_file 44.png coverage-table-add-checklist-items.png
copy_file 45.png coverage-table-manual-entry.png
copy_file 46.png coverage-table-checklist-expanded.png
copy_file 47.png coverage-table-comparison-report.png

# Custom Report
copy_file 48.png custom-report-dashboard.png
copy_file 49.png custom-report-title.png
copy_file 50.png custom-report-upload-documents.png
copy_file 51.png custom-report-description.png
copy_file 52.png custom-report-template-example.png
copy_file 53.png custom-report-generated-output.png

echo "------------------------------------------------------------"
echo "🎉 All screenshot copies complete!"
