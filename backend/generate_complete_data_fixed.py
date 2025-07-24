import pandas as pd

# Load the CSV files
print("Loading CSV files...")
volume_df = pd.read_csv("../VolumeTracings.csv")
file_df = pd.read_csv("FileList.csv")

print(f"VolumeTracings.csv has {len(volume_df)} rows")
print(f"FileList.csv has {len(file_df)} rows")

# Get unique filenames from VolumeTracings and find their ES/ED frames
print("Processing frame data...")
frame_data = {}
for filename in volume_df['FileName'].unique():
    file_traces = volume_df[volume_df['FileName'] == filename]
    if len(file_traces) >= 2:
        frames = file_traces['Frame'].tolist()
        if len(frames) >= 2:
            # ES and ED frames are typically the min and max in the trace
            es_frame = min(frames)
            ed_frame = max(frames)
            # Use correct filename format (just add .mp4, no .avi)
            frame_data[f"{filename}.mp4"] = [es_frame, ed_frame]

# Get cardiac measurements from FileList.csv
print("Processing cardiac data...")
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

# Check for the specific video that was failing
test_video = "0X4724EF4A6021488E.mp4"
if test_video in frame_data:
    print(f"✅ {test_video} frame data: {frame_data[test_video]}")
else:
    print(f"❌ {test_video} NOT found in frame data")

if test_video in cardiac_data:
    print(f"✅ {test_video} cardiac data: {cardiac_data[test_video]}")
else:
    print(f"❌ {test_video} NOT found in cardiac data")

# Generate the complete TypeScript files
print("\nGenerating complete data files...")

with open("complete_frame_data.txt", "w") as f:
    for filename, frames in sorted(frame_data.items()):
        f.write(f"    '{filename}': {frames},\n")

with open("complete_cardiac_data.txt", "w") as f:
    for filename, cardiac in sorted(cardiac_data.items()):
        f.write(f"    '{filename}': {{ ef: {cardiac['ef']:.2f}, esv: {cardiac['esv']:.2f}, edv: {cardiac['edv']:.2f} }},\n")

print(f"✅ Complete frame data saved to complete_frame_data.txt ({len(frame_data)} entries)")
print(f"✅ Complete cardiac data saved to complete_cardiac_data.txt ({len(cardiac_data)} entries)")

# Show first few entries as verification
print("\nFirst 5 frame entries:")
for i, (filename, frames) in enumerate(sorted(frame_data.items())):
    if i < 5:
        print(f"  '{filename}': {frames}")

print("\nFirst 5 cardiac entries:")
for i, (filename, cardiac) in enumerate(sorted(cardiac_data.items())):
    if i < 5:
        print(f"  '{filename}': {cardiac}")
