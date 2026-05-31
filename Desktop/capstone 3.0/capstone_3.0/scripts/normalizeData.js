#!/usr/bin/env node

/**
 * College Cutoff Data Normalization Utility
 * 
 * Normalizes mock college cutoff values to realistic ranges based on:
 * - Institution type (IIT, NIT, IIIT, Government, Private)
 * - Branch type (CSE/IT vs others)
 * - Category-wise scaling and logical ordering
 * 
 * Usage: node scripts/normalizeData.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const DATA_FILE_PATH = path.join(__dirname, '../data/colleges.json');

// Tier-specific scaling multipliers for non-CSE/IT branches
const TIER_MULTIPLIERS = {
  IIT: 0.15,
  NIT: 0.5,
  IIIT: 0.6,
  Government: 1.1,
  Private: 1.1
};

// Tier-specific ranges for CSE/IT branches
const CSE_IT_RANGES = {
  IIT: { general: [60, 250], obc: [40, 180] },
  NIT: { general: [800, 4000], obc: [500, 2500] }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a branch name is CSE or IT
 * @param {string} branchName
 * @returns {boolean}
 */
function isCseOrIt(branchName) {
  const lowerName = branchName.toLowerCase();
  return lowerName.includes('computer science') || lowerName.includes('information technology');
}

/**
 * Generate a random value within a range
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Ensure value is within valid range (minimum 1)
 * @param {number} value
 * @returns {number}
 */
function ensureValidValue(value) {
  return Math.max(1, Math.round(value));
}

/**
 * Maintain logical category order: ST >= SC >= OBC >= General
 * Adjusts category cutoffs to ensure proper hierarchy
 * @param {object} cutoffs - { general, obc, sc, st }
 * @returns {object} - Normalized cutoffs with maintained hierarchy
 */
function enforceLogicalOrder(cutoffs) {
  const { general, obc, sc, st } = cutoffs;

  // Start with general (baseline)
  let normalizedGeneral = ensureValidValue(general);

  // OBC should be >= General, but give some margin
  let normalizedObc = Math.max(
    normalizedGeneral,
    ensureValidValue(obc)
  );

  // SC should be >= OBC
  let normalizedSc = Math.max(
    normalizedObc,
    ensureValidValue(sc)
  );

  // ST should be >= SC
  let normalizedSt = Math.max(
    normalizedSc,
    ensureValidValue(st)
  );

  // Apply small increments to maintain distinct hierarchy
  const increment = Math.max(1, Math.floor(normalizedGeneral * 0.05));
  
  if (normalizedObc === normalizedGeneral) {
    normalizedObc = normalizedGeneral + increment;
  }
  if (normalizedSc === normalizedObc) {
    normalizedSc = normalizedObc + increment;
  }
  if (normalizedSt === normalizedSc) {
    normalizedSt = normalizedSc + increment;
  }

  return {
    general: normalizedGeneral,
    obc: normalizedObc,
    sc: normalizedSc,
    st: normalizedSt
  };
}

/**
 * Normalize cutoffs for a single branch based on college type and branch name
 * @param {object} branch
 * @param {string} collegeType
 * @returns {object} - Normalized branch with updated cutoff
 */
function normalizeBranchCutoffs(branch, collegeType) {
  const branchName = branch.name || '';
  const currentCutoff = branch.cutoff || {};
  let newCutoff = {};

  // Determine if this is a CSE/IT branch
  const isCseIt = isCseOrIt(branchName);

  // Apply tier-specific scaling rules
  if (collegeType === 'IIT') {
    if (isCseIt) {
      // IIT CSE/IT: strict elite ranges
      newCutoff.general = getRandomInRange(
        CSE_IT_RANGES.IIT.general[0],
        CSE_IT_RANGES.IIT.general[1]
      );
      newCutoff.obc = getRandomInRange(
        CSE_IT_RANGES.IIT.obc[0],
        CSE_IT_RANGES.IIT.obc[1]
      );
      newCutoff.sc = Math.max(
        newCutoff.obc,
        Math.round(newCutoff.obc * 1.15)
      );
      newCutoff.st = Math.max(
        newCutoff.sc,
        Math.round(newCutoff.sc * 1.15)
      );
    } else {
      // IIT other branches: multiply by 0.15
      const multiplier = TIER_MULTIPLIERS.IIT;
      newCutoff.general = ensureValidValue(
        (currentCutoff.general || 100) * multiplier
      );
      newCutoff.obc = ensureValidValue(
        (currentCutoff.obc || 150) * multiplier
      );
      newCutoff.sc = ensureValidValue(
        (currentCutoff.sc || 120) * multiplier
      );
      newCutoff.st = ensureValidValue(
        (currentCutoff.st || 110) * multiplier
      );
    }
  } else if (collegeType === 'NIT') {
    if (isCseIt) {
      // NIT CSE/IT: broader ranges
      newCutoff.general = getRandomInRange(
        CSE_IT_RANGES.NIT.general[0],
        CSE_IT_RANGES.NIT.general[1]
      );
      newCutoff.obc = getRandomInRange(
        CSE_IT_RANGES.NIT.obc[0],
        CSE_IT_RANGES.NIT.obc[1]
      );
      newCutoff.sc = Math.max(
        newCutoff.obc,
        Math.round(newCutoff.obc * 1.2)
      );
      newCutoff.st = Math.max(
        newCutoff.sc,
        Math.round(newCutoff.sc * 1.2)
      );
    } else {
      // NIT other branches: multiply by 0.5
      const multiplier = TIER_MULTIPLIERS.NIT;
      newCutoff.general = ensureValidValue(
        (currentCutoff.general || 100) * multiplier
      );
      newCutoff.obc = ensureValidValue(
        (currentCutoff.obc || 150) * multiplier
      );
      newCutoff.sc = ensureValidValue(
        (currentCutoff.sc || 120) * multiplier
      );
      newCutoff.st = ensureValidValue(
        (currentCutoff.st || 110) * multiplier
      );
    }
  } else if (collegeType === 'IIIT') {
    // IIIT all branches: multiply by 0.6
    const multiplier = TIER_MULTIPLIERS.IIIT;
    newCutoff.general = ensureValidValue(
      (currentCutoff.general || 100) * multiplier
    );
    newCutoff.obc = ensureValidValue(
      (currentCutoff.obc || 150) * multiplier
    );
    newCutoff.sc = ensureValidValue(
      (currentCutoff.sc || 120) * multiplier
    );
    newCutoff.st = ensureValidValue(
      (currentCutoff.st || 110) * multiplier
    );
  } else if (collegeType === 'Government' || collegeType === 'Private') {
    // Government & Private: scale by 1.1 (safe/target fallback)
    const multiplier = TIER_MULTIPLIERS[collegeType];
    newCutoff.general = ensureValidValue(
      (currentCutoff.general || 100) * multiplier
    );
    newCutoff.obc = ensureValidValue(
      (currentCutoff.obc || 150) * multiplier
    );
    newCutoff.sc = ensureValidValue(
      (currentCutoff.sc || 120) * multiplier
    );
    newCutoff.st = ensureValidValue(
      (currentCutoff.st || 110) * multiplier
    );
  }

  // Enforce logical boundary safeguards
  newCutoff = enforceLogicalOrder(newCutoff);

  return {
    ...branch,
    cutoff: newCutoff
  };
}

/**
 * Normalize all colleges in the dataset
 * @param {array} colleges
 * @returns {array} - Normalized colleges
 */
function normalizeAllColleges(colleges) {
  return colleges.map(college => {
    const collegeType = college.type || 'Private';

    return {
      ...college,
      branches: (college.branches || []).map(branch =>
        normalizeBranchCutoffs(branch, collegeType)
      )
    };
  });
}

/**
 * Main execution function
 */
function main() {
  try {
    // Log start
    console.log('📊 Starting College Cutoff Normalization...\n');

    // Read current data
    if (!fs.existsSync(DATA_FILE_PATH)) {
      throw new Error(`Data file not found: ${DATA_FILE_PATH}`);
    }

    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const colleges = JSON.parse(fileContent);

    console.log(`✅ Loaded ${colleges.length} colleges from ${DATA_FILE_PATH}`);

    // Validate array structure
    if (!Array.isArray(colleges)) {
      throw new Error('Invalid data format: Expected an array of colleges');
    }

    // Normalize the data
    const normalizedColleges = normalizeAllColleges(colleges);

    // Write back to file with pretty-print formatting
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify(normalizedColleges, null, 2),
      'utf8'
    );

    console.log(`✅ Successfully normalized and saved ${normalizedColleges.length} colleges\n`);

    // Print sample statistics
    console.log('📈 Sample Normalization Results:');
    console.log('────────────────────────────────────────────');

    // Show a few examples
    const sampleColleges = normalizedColleges.slice(0, 3);
    sampleColleges.forEach(college => {
      console.log(`\n📍 ${college.name} (${college.type})`);
      if (college.branches && college.branches.length > 0) {
        college.branches.slice(0, 2).forEach(branch => {
          const cutoff = branch.cutoff;
          console.log(
            `   ${branch.name}: General=${cutoff.general}, OBC=${cutoff.obc}, SC=${cutoff.sc}, ST=${cutoff.st}`
          );
        });
      }
    });

    console.log('\n────────────────────────────────────────────');
    console.log('\n✨ Normalization Complete!\n');
    console.log('Rules Applied:');
    console.log('  • IIT CSE/IT: General [60-250], OBC [40-180]');
    console.log('  • IIT Other: × 0.15 multiplier');
    console.log('  • NIT CSE/IT: General [800-4000], OBC [500-2500]');
    console.log('  • NIT Other: × 0.5 multiplier');
    console.log('  • IIIT All: × 0.6 multiplier');
    console.log('  • Government/Private: × 1.1 multiplier');
    console.log('  • Logical Order: ST ≥ SC ≥ OBC ≥ General');
    console.log('  • Minimum Value: 1 (no zeros)\n');

  } catch (error) {
    console.error('❌ Error during normalization:', error.message);
    process.exit(1);
  }
}

// Execute the script
main();
