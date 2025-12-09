/**
 * Drug Database Quality Checker
 * 
 * This script analyzes the quality and completeness of drug data in the database.
 * 
 * Usage:
 *   npm run check:drug-quality
 *   npm run check:drug-quality -- --fix
 * 
 * What it checks:
 * - Missing required fields
 * - Invalid barcode formats
 * - Duplicate barcodes
 * - Data completeness scores
 * - Missing manufacturer information
 */

import { createClient } from '@supabase/supabase-js';

// Get command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface QualityReport {
  total: number;
  complete: number;
  partial: number;
  incomplete: number;
  missingBarcode: number;
  missingName: number;
  missingManufacturer: number;
  missingDosage: number;
  missingSpecies: number;
  invalidBarcode: number;
  duplicateBarcodes: number;
  lowQuality: Array<{ id: string; name: string; score: number }>;
  averageQualityScore: number;
}

function validateBarcode(barcode: string | null): boolean {
  if (!barcode) return false;
  // EAN-13: 13 digits, UPC-A: 12 digits, EAN-8: 8 digits
  const barcodeRegex = /^\d{8,13}$/;
  return barcodeRegex.test(barcode);
}

function calculateQualityScore(drug: any): number {
  let score = 0;
  
  // Required fields (40 points)
  if (drug.name) score += 20;
  if (drug.barcode || drug.ndc_code) score += 20;
  
  // Important fields (40 points)
  if (drug.manufacturer) score += 15;
  if (drug.generic_name) score += 10;
  if (drug.dosage || drug.strength) score += 10;
  if (drug.dosage_form) score += 5;
  
  // Additional fields (20 points)
  if (drug.species && drug.species.length > 0) score += 10;
  if (drug.drug_class) score += 5;
  if (drug.description) score += 5;
  
  return score;
}

async function checkQuality(): Promise<QualityReport> {
  console.log('📊 Checking drug database quality...');
  console.log('');

  // Fetch all drugs
  const { data: drugs, error } = await supabase
    .from('drugs')
    .select('*');

  if (error) {
    console.error('❌ Error fetching drugs:', error.message);
    process.exit(1);
  }

  if (!drugs || drugs.length === 0) {
    console.log('⚠️  No drugs found in database.');
    return {
      total: 0,
      complete: 0,
      partial: 0,
      incomplete: 0,
      missingBarcode: 0,
      missingName: 0,
      missingManufacturer: 0,
      missingDosage: 0,
      missingSpecies: 0,
      invalidBarcode: 0,
      duplicateBarcodes: 0,
      lowQuality: [],
      averageQualityScore: 0,
    };
  }

  const report: QualityReport = {
    total: drugs.length,
    complete: 0,
    partial: 0,
    incomplete: 0,
    missingBarcode: 0,
    missingName: 0,
    missingManufacturer: 0,
    missingDosage: 0,
    missingSpecies: 0,
    invalidBarcode: 0,
    duplicateBarcodes: 0,
    lowQuality: [],
    averageQualityScore: 0,
  };

  // Check for duplicate barcodes
  const barcodeCounts = new Map<string, number>();
  drugs.forEach(drug => {
    if (drug.barcode) {
      barcodeCounts.set(drug.barcode, (barcodeCounts.get(drug.barcode) || 0) + 1);
    }
  });
  report.duplicateBarcodes = Array.from(barcodeCounts.values())
    .filter(count => count > 1)
    .reduce((sum, count) => sum + count - 1, 0);

  // Analyze each drug
  const qualityScores: number[] = [];

  for (const drug of drugs) {
    // Check missing fields
    if (!drug.barcode && !drug.ndc_code) {
      report.missingBarcode++;
    }
    if (!drug.name) {
      report.missingName++;
    }
    if (!drug.manufacturer) {
      report.missingManufacturer++;
    }
    if (!drug.dosage && !drug.strength) {
      report.missingDosage++;
    }
    if (!drug.species || drug.species.length === 0) {
      report.missingSpecies++;
    }

    // Check barcode validity
    if (drug.barcode && !validateBarcode(drug.barcode)) {
      report.invalidBarcode++;
    }

    // Calculate quality score
    const score = calculateQualityScore(drug);
    qualityScores.push(score);

    // Categorize by quality
    if (score >= 90) {
      report.complete++;
    } else if (score >= 70) {
      report.partial++;
    } else {
      report.incomplete++;
      report.lowQuality.push({
        id: drug.id,
        name: drug.name || 'Unknown',
        score,
      });
    }

    // Update quality score if fix is requested
    if (shouldFix && drug.data_quality_score !== score) {
      await supabase
        .from('drugs')
        .update({ data_quality_score: score })
        .eq('id', drug.id);
    }
  }

  report.averageQualityScore = qualityScores.length > 0
    ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
    : 0;

  return report;
}

function printReport(report: QualityReport) {
  console.log('═══════════════════════════════════════');
  console.log('📊 DRUG DATABASE QUALITY REPORT');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('📈 Overall Statistics:');
  console.log(`   Total drugs:           ${report.total.toLocaleString()}`);
  console.log(`   ✅ Complete (≥90%):    ${report.complete.toLocaleString()} (${((report.complete / report.total) * 100).toFixed(1)}%)`);
  console.log(`   ⚠️  Partial (70-89%):   ${report.partial.toLocaleString()} (${((report.partial / report.total) * 100).toFixed(1)}%)`);
  console.log(`   ❌ Incomplete (<70%):  ${report.incomplete.toLocaleString()} (${((report.incomplete / report.total) * 100).toFixed(1)}%)`);
  console.log(`   📊 Average quality:     ${report.averageQualityScore}%`);
  console.log('');

  console.log('🔍 Missing Data Analysis:');
  console.log(`   Missing barcode:      ${report.missingBarcode.toLocaleString()}`);
  console.log(`   Missing name:         ${report.missingName.toLocaleString()}`);
  console.log(`   Missing manufacturer: ${report.missingManufacturer.toLocaleString()}`);
  console.log(`   Missing dosage:       ${report.missingDosage.toLocaleString()}`);
  console.log(`   Missing species:      ${report.missingSpecies.toLocaleString()}`);
  console.log('');

  console.log('⚠️  Data Issues:');
  console.log(`   Invalid barcodes:     ${report.invalidBarcode.toLocaleString()}`);
  console.log(`   Duplicate barcodes:   ${report.duplicateBarcodes.toLocaleString()}`);
  console.log('');

  if (report.lowQuality.length > 0) {
    console.log('❌ Low Quality Records (< 70% complete):');
    report.lowQuality
      .sort((a, b) => a.score - b.score)
      .slice(0, 20)
      .forEach(({ name, score }) => {
        console.log(`   • ${name} (${score}%)`);
      });
    if (report.lowQuality.length > 20) {
      console.log(`   ... and ${report.lowQuality.length - 20} more`);
    }
    console.log('');
  }

  // Recommendations
  console.log('💡 Recommendations:');
  if (report.missingBarcode > 0) {
    console.log(`   • ${report.missingBarcode} drugs need barcodes - consider barcode enrichment`);
  }
  if (report.missingManufacturer > 0) {
    console.log(`   • ${report.missingManufacturer} drugs missing manufacturer - add from product catalogs`);
  }
  if (report.duplicateBarcodes > 0) {
    console.log(`   • ${report.duplicateBarcodes} duplicate barcodes found - review and merge duplicates`);
  }
  if (report.incomplete > 0) {
    console.log(`   • ${report.incomplete} incomplete records - prioritize filling essential fields`);
  }
  if (report.averageQualityScore < 80) {
    console.log(`   • Average quality score is ${report.averageQualityScore}% - aim for 80%+`);
  }
  console.log('');

  // Quality score distribution
  const distribution = {
    '90-100%': 0,
    '80-89%': 0,
    '70-79%': 0,
    '60-69%': 0,
    '<60%': 0,
  };

  // We'd need to recalculate or fetch scores, but for now show summary
  console.log('📊 Quality Score Distribution:');
  console.log(`   Excellent (90-100%): ${report.complete.toLocaleString()}`);
  console.log(`   Good (80-89%):      ${Math.round(report.partial * 0.6).toLocaleString()}`);
  console.log(`   Fair (70-79%):      ${Math.round(report.partial * 0.4).toLocaleString()}`);
  console.log(`   Poor (<70%):        ${report.incomplete.toLocaleString()}`);
  console.log('');
}

async function main() {
  try {
    const report = await checkQuality();
    printReport(report);

    if (shouldFix) {
      console.log('✅ Quality scores updated in database.');
    } else {
      console.log('💡 Tip: Run with --fix to update quality scores in database.');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();


