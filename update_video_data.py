import os
import re

# Directory containing the actual mp4 files
video_dir = "c:/Users/OTHNIEL/healthecogamemainbranch/thisisfinaithink/homedesign-page/color-reimagined-design-now/public/mp4"

# Get all mp4 files in the directory
mp4_files = [f for f in os.listdir(video_dir) if f.endswith('.mp4')]

# Convert mp4 filenames to avi equivalents for matching with CSV data
avi_filenames = [f.replace('.mp4', '.avi') for f in mp4_files]

print(f"Found {len(mp4_files)} mp4 files")
print(f"First 10 mp4 files: {mp4_files[:10]}")
print(f"First 10 avi equivalents: {avi_filenames[:10]}")

# Frame data from the earlier extraction (first 50 entries as sample)
frame_data = {
    '0X100009310A3BD7FC.avi': [46, 61],
    '0X1002E8FBACD08477.avi': [3, 18],
    '0X1005D03EED19C65B.avi': [24, 35],
    '0X10075961BC11C88E.avi': [91, 108],
    '0X10094BA0A028EAC3.avi': [137, 156],
    '0X100CF05D141FF143.avi': [132, 148],
    '0X100E3B8D3280BEC5.avi': [25, 38],
    '0X100E491B3CD58DE2.avi': [49, 75],
    '0X100F044876B98F90.avi': [56, 72],
    '0X101026B90DAE7E95.avi': [45, 62],
    '0X1012703CDC1436FE.avi': [154, 172],
    '0X1013E8A4864781B.avi': [35, 46],
    '0X1018521A3BC5CDBA.avi': [42, 57],
    '0X101C388397F66EDB.avi': [46, 62],
    '0X101CFC9C5351DCBE.avi': [59, 73],
    '0X101E654AF3FC07A8.avi': [109, 132],
    '0X10267ADF2E644E0.avi': [150, 172],
    '0X102AE9C68B2C46DA.avi': [48, 63],
    '0X102C51641C321436.avi': [0, 15],
    '0X102CFB07F752AAE6.avi': [163, 184],
}

cardiac_data = {
    '0X100009310A3BD7FC': { 'ef': 60.63, 'esv': 18.99, 'edv': 48.25 },
    '0X1002E8FBACD08477': { 'ef': 64.92, 'esv': 22.60, 'edv': 64.42 },
    '0X1005D03EED19C65B': { 'ef': 54.50, 'esv': 51.82, 'edv': 113.86 },
    '0X10075961BC11C88E': { 'ef': 55.32, 'esv': 43.38, 'edv': 97.13 },
    '0X10094BA0A028EAC3': { 'ef': 64.22, 'esv': 24.25, 'edv': 67.77 },
    '0X100CF05D141FF143': { 'ef': 57.06, 'esv': 31.86, 'edv': 74.22 },
    '0X100E3B8D3280BEC5': { 'ef': 63.97, 'esv': 22.51, 'edv': 62.46 },
    '0X100E491B3CD58DE2': { 'ef': 61.33, 'esv': 31.64, 'edv': 81.82 },
    '0X100F044876B98F90': { 'ef': 59.76, 'esv': 25.23, 'edv': 62.69 },
    '0X101026B90DAE7E95': { 'ef': 59.41, 'esv': 36.25, 'edv': 89.30 },
    '0X1012703CDC1436FE': { 'ef': 58.43, 'esv': 31.48, 'edv': 75.69 },
    '0X1013E8A4864781B': { 'ef': 62.78, 'esv': 37.83, 'edv': 101.66 },
    '0X1018521A3BC5CDBA': { 'ef': 62.28, 'esv': 23.24, 'edv': 61.65 },
    '0X101C388397F66EDB': { 'ef': 59.43, 'esv': 24.52, 'edv': 60.42 },
    '0X101CFC9C5351DCBE': { 'ef': 56.90, 'esv': 41.37, 'edv': 96.00 },
    '0X101E654AF3FC07A8': { 'ef': 71.06, 'esv': 15.70, 'edv': 54.24 },
    '0X10267ADF2E644E0': { 'ef': 60.93, 'esv': 24.52, 'edv': 62.74 },
    '0X102AE9C68B2C46DA': { 'ef': 61.75, 'esv': 23.09, 'edv': 60.35 },
    '0X102C51641C321436': { 'ef': 73.28, 'esv': 12.84, 'edv': 48.07 },
    '0X102CFB07F752AAE6': { 'ef': 60.70, 'esv': 29.46, 'edv': 75.00 },
}

# Find matching files
matching_frames = {}
matching_cardiac = {}

for avi_file in avi_filenames:
    if avi_file in frame_data:
        mp4_file = avi_file.replace('.avi', '.mp4')
        matching_frames[mp4_file] = frame_data[avi_file]
        
        # Get cardiac data (remove .avi extension for cardiac data key)
        cardiac_key = avi_file.replace('.avi', '')
        if cardiac_key in cardiac_data:
            matching_cardiac[mp4_file] = cardiac_data[cardiac_key]

print(f"\nFound {len(matching_frames)} matching frame data entries")
print(f"Found {len(matching_cardiac)} matching cardiac data entries")

# Print TypeScript format for the matching data
print("\n// Frame data for videos in public/mp4:")
print("const frameData: Record<string, number[]> = {")
for mp4_file, frames in matching_frames.items():
    print(f"  '{mp4_file}': {frames},")
print("};")

print("\n// Cardiac data for videos in public/mp4:")
print("const cardiacData: Record<string, CardiacMeasurement> = {")
for mp4_file, cardiac in matching_cardiac.items():
    print(f"  '{mp4_file}': {{ ef: {cardiac['ef']:.2f}, esv: {cardiac['esv']:.2f}, edv: {cardiac['edv']:.2f} }},")
print("};")

# Check a few specific files from the directory
sample_mp4s = mp4_files[:10]
print(f"\nChecking data availability for first 10 mp4 files:")
for mp4 in sample_mp4s:
    avi_equiv = mp4.replace('.mp4', '.avi')
    cardiac_key = mp4.replace('.mp4', '')
    has_frame = avi_equiv in frame_data
    has_cardiac = cardiac_key in cardiac_data
    print(f"{mp4}: frame_data={has_frame}, cardiac_data={has_cardiac}")
