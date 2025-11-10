# Image Compressor - Test Verification Checklist

## Pre-Test Setup
- [ ] Backend running on port 5000 (`npm run dev` in backend folder)
- [ ] Frontend running on port 3000 (dev server running)
- [ ] OPENAI_API_KEY set in `.env` file
- [ ] Test image files prepared (JPEG and PNG, various sizes)

## Unit Tests

### Backend Service Tests
- [ ] `compressImage()` - JPEG compression reduces file size
- [ ] `compressImage()` - PNG compression reduces file size
- [ ] `generateImageDescription()` - Returns non-empty string
- [ ] `generateOptimizedFilename()` - Returns hyphenated filename
- [ ] `getMimeType()` - Correctly identifies JPEG
- [ ] `getMimeType()` - Correctly identifies PNG
- [ ] `processImage()` - Single image processing works
- [ ] `processImageBatch()` - Multiple image processing works

### Frontend Service Tests
- [ ] `compressAndRenameImages()` - Sends FormData correctly
- [ ] `downloadSingleImage()` - Downloads blob correctly
- [ ] `downloadBatchAsZip()` - Downloads ZIP correctly
- [ ] `formatFileSize()` - Formats bytes to KB/MB correctly

## Integration Tests

### Upload & Compression Flow
- [ ] Upload single JPEG image
  - File appears in uploaded list
  - Correct file size shown
  - File can be removed
- [ ] Upload single PNG image
  - Works same as JPEG
- [ ] Upload multiple images (5+)
  - All appear in list
  - Can remove individual images
  - Can clear all at once

### Keyword Input
- [ ] Enter single keyword
  - Text appears in textarea
  - Clears properly
- [ ] Enter multiple keywords (one per line)
  - Each line is separate keyword
  - Empty lines are ignored
  - Whitespace is trimmed

### Processing
- [ ] Click "Compress & Rename Images"
  - Shows loading spinner
  - Processing takes reasonable time
  - Success page appears
  - Displays processed image count
  - Shows compression statistics

### Results Display
- [ ] Each image shows:
  - Original filename
  - Optimized filename
  - AI description
  - Secondary keyword used
  - Original size
  - Compressed size
  - Compression percentage
- [ ] Images sorted logically
- [ ] Results are readable/scannable

### Downloads
- [ ] Download single image
  - File downloads
  - Filename matches optimized name
  - File opens correctly
  - File is actually compressed
- [ ] Download all as ZIP
  - ZIP file downloads
  - Contains all images
  - Filenames preserved in ZIP
  - ZIP extracts properly

### Process More
- [ ] Click "Process More" button
  - Returns to upload screen
  - Previous results cleared
  - Keywords cleared
  - File list empty

## Error Handling Tests

### File Validation
- [ ] Upload .gif file
  - Rejected with error message
  - Error message visible to user
- [ ] Upload .webp file
  - Rejected with error message
- [ ] Upload .txt file
  - Rejected with error message

### Size Validation
- [ ] Upload file > 10MB
  - Rejected with error message
  - "File size exceeds 10MB" shown

### Input Validation
- [ ] Click process without uploading files
  - Shows "Please upload at least one image"
- [ ] Click process without keywords
  - Shows "Please enter at least one secondary keyword"
- [ ] Upload files then remove keywords
  - Process button disabled
  - Cannot submit without keywords

### API Errors
- [ ] Simulate network error during compress
  - Error message displayed
  - User can retry
  - Processing stops gracefully
- [ ] API key invalid/missing
  - Falls back to default description
  - Feature still works
  - User doesn't see API error

## Performance Tests
- [ ] Upload 5x 5MB images
  - Processing completes in < 2 minutes
  - No memory leaks
  - UI remains responsive
- [ ] ZIP download with 10+ images
  - ZIP creates successfully
  - Download completes without hanging

## Cross-Browser Tests
- [ ] Chrome/Chromium
  - [ ] All features work
  - [ ] Downloads have correct names
  - [ ] Drag-drop works
- [ ] Firefox
  - [ ] All features work
  - [ ] Downloads work
- [ ] Safari
  - [ ] All features work
  - [ ] UTF-8 filenames download correctly

## Mobile Responsiveness Tests
- [ ] iPhone (small screen)
  - [ ] Upload area visible
  - [ ] Keywords input accessible
  - [ ] Button clickable
  - [ ] Results grid responsive
- [ ] iPad (medium screen)
  - [ ] Two-column layout works
  - [ ] All features accessible

## Production Build Tests
- [ ] Run `npm run build` in frontend
  - Builds without errors
  - No TypeScript errors
  - Bundle size reasonable
- [ ] Frontend built files work
  - API calls use relative paths
  - Works with backend on different port
- [ ] Backend syntax valid
  - `node --check` passes all files

## API Endpoint Tests

### POST /api/image-compressor/compress
- [ ] Request with valid images
  - Returns 200 status
  - Returns success: true
  - Returns processed images array
  - Each image has required fields
- [ ] Request without images
  - Returns 400 status
  - Returns error message
- [ ] Request with invalid file types
  - Returns 400 status
  - Lists invalid files
- [ ] Request without keywords
  - Returns 400 status

### POST /api/image-compressor/download
- [ ] Request with valid image buffer
  - Returns 200 status
  - Returns image blob
  - Content-Type correct
  - Filename header set
- [ ] Request without image buffer
  - Returns 400 status

### POST /api/image-compressor/download-batch
- [ ] Request with multiple images
  - Returns 200 status
  - Returns ZIP file
  - Content-Type is application/zip
  - All images in archive
- [ ] Request with empty array
  - Returns 400 status

## Data Quality Tests

### Filename Generation
- [ ] "organic coffee" + "freshly roasted beans"
  - Result: "organic-coffee-freshly-roasted-beans.jpg"
- [ ] "Premium Product" + "Beautiful display with lighting"
  - Result: "premium-product-beautiful-display-with-lighting.jpg"
- [ ] Keywords with special chars "@#$"
  - Special chars removed
  - Result is valid filename
- [ ] Very long description (100+ words)
  - Truncated to max 200 chars
  - No broken words
  - Ends at word boundary

### Compression Quality
- [ ] JPEG original 500KB → compressed < 300KB
  - Visual quality acceptable
  - No artifacts
- [ ] PNG original 400KB → compressed < 250KB
  - Transparency preserved
  - No quality loss

### AI Descriptions
- [ ] Description is 10-15 words
  - Count words
  - Reasonable description of image
- [ ] Description relevant to image
  - Describes actual content
  - Not generic/placeholder

## Accessibility Tests
- [ ] Keyboard navigation
  - Tab through upload, keywords, button
  - Enter key submits
  - Esc key clears errors
- [ ] Screen reader
  - File upload labeled
  - Buttons have aria-labels
  - Error messages announced
- [ ] Color contrast
  - Text readable on backgrounds
  - Error messages stand out

## Final Verification
- [ ] All 10 bugs fixed and working
- [ ] No console errors in dev tools
- [ ] No uncaught exceptions
- [ ] Feature complete and stable
- [ ] Code quality improved
