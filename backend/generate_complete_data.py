import pandas as pd
import os

# Load the CSV files
volume_df = pd.read_csv("../VolumeTracings.csv")
file_df = pd.read_csv("FileList.csv")

print(f"VolumeTracings.csv has {len(volume_df)} rows")
print(f"FileList.csv has {len(file_df)} rows")

# Get unique filenames from VolumeTracings and find their ES/ED frames
frame_data = {}
for filename in volume_df['FileName'].unique():
    file_traces = volume_df[volume_df['FileName'] == filename]
    if len(file_traces) >= 2:
        frames = file_traces['Frame'].tolist()
        if len(frames) >= 2:
            # ES and ED frames are typically the min and max in the trace
            es_frame = min(frames)
            ed_frame = max(frames)
            frame_data[f"{filename}.mp4"] = [es_frame, ed_frame]

# Get cardiac measurements from FileList.csv
cardiac_data = {}
for _, row in file_df.iterrows():
    filename = f"{row['FileName']}.mp4"
    cardiac_data[filename] = {
        'ef': round(float(row['EF']), 2),
        'esv': round(float(row['ESV']), 2),
        'edv': round(float(row['EDV']), 2)
    }

print(f"Found frame data for {len(frame_data)} videos")
print(f"Found cardiac data for {len(cardiac_data)} videos")

# Generate TypeScript code
print("\n// Complete frame data extracted from VolumeTracings.csv")
print("const frameData: Record<string, number[]> = {")
count = 0
for filename, frames in sorted(frame_data.items()):
    print(f"  '{filename}': {frames},")
    count += 1
    if count > 50:  # Show first 50 for preview
        print("  // ... and many more entries")
        break
print("};")

print(f"\n// Complete cardiac data extracted from FileList.csv")
print("const cardiacData: Record<string, CardiacMeasurement> = {")
count = 0
for filename, cardiac in sorted(cardiac_data.items()):
    if count < 50:  # Show first 50 for preview
        print(f"  '{filename}': {{ ef: {cardiac['ef']:.2f}, esv: {cardiac['esv']:.2f}, edv: {cardiac['edv']:.2f} }},")
    count += 1
    if count == 50:
        print("  // ... and many more entries")

print("};")

# Save complete data to files for easy import
with open("complete_frame_data.txt", "w") as f:
    for filename, frames in sorted(frame_data.items()):
        f.write(f"  '{filename}': {frames},\n")

with open("complete_cardiac_data.txt", "w") as f:
    for filename, cardiac in sorted(cardiac_data.items()):
        f.write(f"  '{filename}': {{ ef: {cardiac['ef']:.2f}, esv: {cardiac['esv']:.2f}, edv: {cardiac['edv']:.2f} }},\n")

print(f"\nTotal videos with frame data: {len(frame_data)}")
print(f"Total videos with cardiac data: {len(cardiac_data)}")
print("Complete data saved to complete_frame_data.txt and complete_cardiac_data.txt")
