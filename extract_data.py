import pandas as pd

# Read the CSV files
volume_df = pd.read_csv('VolumeTracings.csv')
file_df = pd.read_csv('backend/FileList.csv')

# Extract frame numbers
print("Frame data:")
grouped = volume_df.groupby('FileName')['Frame'].unique()
for filename, frames in grouped.items():
    frames_sorted = sorted(frames)
    print(f"'{filename}': {frames_sorted},")

print("\nCardiac measurements:")
for _, row in file_df.iterrows():
    filename = f"{row['FileName']}.avi"
    print(f"'{row['FileName']}': {{ ef: {row['EF']:.2f}, esv: {row['ESV']:.2f}, edv: {row['EDV']:.2f} }},")
