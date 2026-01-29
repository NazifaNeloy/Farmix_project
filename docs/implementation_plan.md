# Pest ID with Custom RAG Implementation Plan

## Goal Description
Implement "Pest ID with Custom RAG" using Gemini Vision API.
-   **Input**: User uploads/captures an image.
-   **Process**:
    1.  Convert image to Base64.
    2.  Send to Gemini API with a prompt containing a custom `PEST_KNOWLEDGE_BASE`.
    3.  Gemini identifies the pest and provides a solution based *only* on the provided context.
-   **Output**: Bangla result card with Name, Risk, and Organic Solution.

## Proposed Changes

### Services
#### [NEW] [geminiService.js](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/services/geminiService.js)
-   **Constants**: Define `PEST_KNOWLEDGE_BASE` (JSON of Bangladeshi pests: Brown Planthopper, Stem Borer, etc.).
-   **Function**: `identifyPest(imageBase64)`
    -   Construct prompt: "Analyze this image... Cross-reference with [JSON]... Output in Bangla..."
    -   Call Gemini API (`gemini-1.5-flash` or similar).
    -   Parse and return JSON response.

### Components
#### [MODIFY] [ScannerPage.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/pages/ScannerPage.jsx)
-   Replace `useTeachableMachine` logic with `geminiService`.
-   **UI Updates**:
    -   Keep Camera/Upload UI.
    -   Update "Analyzing" state to show it's processing with Gemini.
    -   Update Result Card to display the rich data (Risk Badge, Solution, etc.) returned by Gemini.

    -   Update Result Card to display the rich data (Risk Badge, Solution, etc.) returned by Gemini.

### [MODIFY] [CommunityMap.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/CommunityMap.jsx)
-   **Logic Update**:
    -   Always generate 10-15 mock "neighbor" markers around the user's district center.
    -   Ensure these markers have random crops (Paddy, Potato, etc.) and risk levels (High/Low).
    -   Mix these with any real user batches found (if any).
    -   Ensure map centers on the user's district.

    -   Mix these with any real user batches found (if any).
    -   Ensure map centers on the user's district.

### [MODIFY] [ProfileSection.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/dashboard/ProfileSection.jsx)
-   **Explicit Data Fetching**:
    -   Implement `useEffect` to fetch user document directly from Firestore using `uid`.
    -   Bypass `AuthContext` for display data to ensure latest `phone` and `location` are shown.
    -   Fallback to "Complete Profile" if data is missing.

### [MODIFY] [CommunityMap.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/CommunityMap.jsx)
-   **UI Fixes**:
    -   Apply `z-0` to `MapContainer`.
    -   Ensure parent container has defined height and `relative`.
-   **Logic Updates**:
    -   Implement `MapUpdater` component to auto-center map on user's district.
    -   Fetch batches filtered by `district == userProfile.district`.
-   **Visuals**:
    -   Use `CircleMarker` instead of standard `Marker`.
    -   **Red Circle**: High/Critical Risk (Fill: `#EF4444`).
    -   **Green Circle**: Safe/Low Risk (Fill: `#22C55E`).
    -   **Tooltip**: Show "Crop: [Type]" and "Risk: [Level]". No names.

### [NEW] [RiskAlertModal.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/RiskAlertModal.jsx)
-   **UI**:
    -   Dark theme background (`bg-gray-900` or similar).
    -   Title: "farmix-59170.web.app says" (or "Farmix Alert").
    -   Message: Dynamic risk warning.
    -   Buttons: "OK" (Dismiss).
-   **Props**: `isOpen`, `onClose`, `message`.

### [MODIFY] [ActiveBatchesSection.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/dashboard/ActiveBatchesSection.jsx)
-   **Logic**:
    -   Import `RiskAlertModal`.
    -   Check for high-risk batches in `useEffect`.
    -   Trigger modal if high risk found.

### [MODIFY] [App.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/App.jsx)
-   **Layout**: Remove global padding (`px-4 sm:px-6 lg:px-8 py-6`) from the `<main>` tag to allow full-width pages.

### [MODIFY] [AnalyticsSection.jsx](file:///Users/neloy/Documents/Farmix_Heck_Fest/src/components/dashboard/AnalyticsSection.jsx)
-   **Logic**:
    -   Implement `calculateLevel(batches)` function.
    -   **Points System**:
        -   50 points per batch.
        -   1 point per 10kg harvested.
    -   **Levels**:
        -   Level 1: 0-200 pts.
        -   Level 2: 200-500 pts.
        -   Level 3: 500+ pts.
    -   **Progress**: Calculate percentage to next level.
    -   **Next Achievement**: Dynamic based on current stats.
-   **UI**:
    -   Replace hardcoded "0%" and "0 points" with calculated values.
    -   Update progress bar width dynamically.

## Verification Plan
### Manual Verification
-   **Upload**: Upload a picture of a common pest (e.g., Brown Planthopper).
-   **Result**: Verify the output is in Bangla and matches the `PEST_KNOWLEDGE_BASE` data.
-   **Fallback**: Upload a random non-pest image to see how it handles unknown objects (should say "Unknown" or similar).
