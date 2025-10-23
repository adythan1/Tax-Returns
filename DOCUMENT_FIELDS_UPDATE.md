# Document Fields Update Reference

## Updated Document List

This document outlines the new document fields for the portal form.

### Field Names (camelCase for code):
1. `w2` - W2 - Payroll Document (Multiple: YES)
2. `driversLicense` - Driver's License (Multiple: NO)  
3. `socialSecurityCard` - Social Security Card (Multiple: NO)
4. `form1095` - 1095 - Health Coverage (Multiple: YES)
5. `form1099NEC` - 1099 NEC - Miscellaneous Income (Multiple: YES)
6. `form1098` - 1098 - Mortgage Interest (Multiple: YES)
7. `form1098T` - 1098-T - Tuition Statement (Multiple: YES)
8. `form1098E` - 1098-E - Student Loan Interest (Multiple: YES)
9. `k1` - K1 Form - LLC/Partnership (Multiple: YES)
10. `other` - Other Documents (Multiple: YES)

### Accordion Sections:

**1. Payroll Documents**
- W2 Form (Multiple uploads allowed with + icon)
- Note: "Most clients have 3-5"

**2. Identification Documents**
- Driver's License
- Social Security Card

**3. Health Coverage Documents**  
- 1095 - Health Coverage (Multiple uploads allowed with + icon)

**4. Miscellaneous Income Documents**
- 1099 NEC - Miscellaneous Income (Multiple uploads allowed with + icon)

**5. Mortgage & Interest Documents**
- 1098 - Mortgage Interest (Multiple uploads allowed with + icon)
- 1098-T - Tuition Statement (Multiple uploads allowed with + icon)
- 1098-E - Student Loan Interest (Multiple uploads allowed with + icon)

**6. LLC/Partnership Documents**
- K1 Form - LLC/Partnership (Multiple uploads allowed with + icon)

**7. Other Documents**
- Other Documents (Multiple uploads allowed with + icon)

### Changes from Previous Version:
- Added `form1099NEC` (previously just `form1099`)
- Added `form1098` (new)
- Added `form1098T` (new)
- Added `form1098E` (new)
- Changed `ssnCard` to `socialSecurityCard`
- Reorganized sections to match client flow
- Added Plus icons for fields that allow multiple uploads
- Added helper text for W2 section

### Implementation Notes:
- All sections allow multiple file uploads
- Plus icon (from lucide-react) indicates multiple uploads encouraged
- Button text changes from "Upload" to "Add More" after first file
- File counter badge shows number of uploaded files
- Each file can be removed individually with × button
