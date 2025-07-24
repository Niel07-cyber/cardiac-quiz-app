import pandas as pd
import os

# Get list of actual video files
public_mp4_dir = "public/mp4"
actual_videos = []
if os.path.exists(public_mp4_dir):
    for file in os.listdir(public_mp4_dir):
        if file.endswith('.mp4'):
            # Convert .mp4 to .avi for matching with CSV data
            avi_name = file.replace('.mp4', '.avi')
            actual_videos.append(avi_name)

print(f"Found {len(actual_videos)} actual video files")
print("Sample filenames:", actual_videos[:5])

# Load the CSV files
volume_tracings = pd.read_csv('VolumeTracings.csv')
file_list = pd.read_csv('backend/FileList.csv')

print(f"VolumeTracings.csv has {len(volume_tracings)} rows")
print(f"FileList.csv has {len(file_list)} rows")

# Extract frame numbers for actual videos
print("\n=== EXTRACTING FRAME NUMBERS FOR ACTUAL VIDEOS ===")
frame_data = {}
for video_name in actual_videos:
    # Get frame data for this video
    video_frames = volume_tracings[volume_tracings['FileName'] == video_name]['Frame'].tolist()
    if video_frames:
        # Get unique frame numbers and sort them
        unique_frames = sorted(set(video_frames))
        # Typically we expect 2 frames: ES (End-Systolic) and ED (End-Diastolic)  
        if len(unique_frames) >= 2:
            frame_data[video_name] = unique_frames[:2]  # Take first 2 frames
            print(f"{video_name}: {unique_frames[:2]}")
        else:
            print(f"{video_name}: Only {len(unique_frames)} frame(s) found: {unique_frames}")

print(f"\nFrame data extracted for {len(frame_data)} videos out of {len(actual_videos)} actual videos")

# Extract cardiac measurements for actual videos  
print("\n=== EXTRACTING CARDIAC MEASUREMENTS FOR ACTUAL VIDEOS ===")
cardiac_data = {}
for video_name in actual_videos:
    # Remove .avi extension to match FileList.csv format
    video_id = video_name.replace('.avi', '')
    
    # Find matching row in FileList.csv
    matching_rows = file_list[file_list['FileName'] == video_id]
    if not matching_rows.empty:
        row = matching_rows.iloc[0]
        ef = row['EF']
        esv = row['ESV'] 
        edv = row['EDV']
        cardiac_data[video_id] = {'ef': ef, 'esv': esv, 'edv': edv}
        print(f"{video_id}: EF={ef:.2f}, ESV={esv:.2f}, EDV={edv:.2f}")
    else:
        print(f"{video_id}: No cardiac data found")

print(f"\nCardiac data extracted for {len(cardiac_data)} videos out of {len(actual_videos)} actual videos")

# Generate the videoData.ts content
print("\n=== GENERATING VIDEDATA.TS CONTENT ===")
print("Frame data for videoData.ts:")
print("  const frameData: Record<string, number[]> = {")
for video_name, frames in frame_data.items():
    print(f"    '{video_name}': {frames},")
print("  };")

print("\nCardiac data for videoData.ts:")
print("  const cardiacData: Record<string, { ef: number; esv: number; edv: number }> = {")
for video_id, data in cardiac_data.items():
    ef = data['ef']
    esv = data['esv'] 
    edv = data['edv']
    print(f"    '{video_id}': {{ ef: {ef:.2f}, esv: {esv:.2f}, edv: {edv:.2f} }},")
print("  };")
