#!/usr/bin/env python3
import pandas as pd
import os

def create_complete_video_data():
    print("🔄 Creating complete videoData.ts file...")
    
    # Read VolumeTracings.csv for frame data
    volume_df = pd.read_csv('VolumeTracings.csv')
    print(f"📊 Loaded {len(volume_df)} volume tracing entries")
    
    # Read FileList.csv for cardiac measurements
    file_df = pd.read_csv('backend/FileList.csv')
    print(f"📊 Loaded {len(file_df)} file entries")
    
    # Group volume tracings by FileName to get ES and ED frames
    frame_data = {}
    for filename in volume_df['FileName'].unique():
        video_traces = volume_df[volume_df['FileName'] == filename]
        frames = sorted(video_traces['Frame'].values)
        if len(frames) >= 2:
            # Typically ES (End Systole) is the minimum volume frame
            # and ED (End Diastole) is the maximum volume frame
            es_frame = frames[0]  # Usually the first/smallest
            ed_frame = frames[-1]  # Usually the last/largest
            
            # Convert filename format: remove .avi and add .mp4
            video_id = filename.replace('.avi', '.mp4')
            frame_data[video_id] = {
                'es': es_frame,
                'ed': ed_frame
            }
    
    print(f"✅ Extracted frame data for {len(frame_data)} videos")
    
    # Get cardiac data
    cardiac_data = {}
    for _, row in file_df.iterrows():
        filename = f"{row['FileName']}.mp4"
        cardiac_data[filename] = {
            'ef': round(row['EF'], 2),
            'esv': round(row['ESV'], 2),
            'edv': round(row['EDV'], 2)
        }
    
    print(f"✅ Extracted cardiac data for {len(cardiac_data)} videos")
    
    # Create the complete videoData.ts content
    ts_content = """// Complete video metadata for all available videos
// This file contains frame numbers and cardiac measurements for the entire dataset

export interface VideoMetadata {
  es: number;
  ed: number;
}

export interface CardiacData {
  ef: number;
  esv: number;
  edv: number;
}

export const frameData: Record<string, VideoMetadata> = {
"""
    
    # Add frame data
    for video_id, frames in sorted(frame_data.items()):
        ts_content += f"  '{video_id}': {{ es: {frames['es']}, ed: {frames['ed']} }},\n"
    
    ts_content += "};\n\nexport const cardiacData: Record<string, CardiacData> = {\n"
    
    # Add cardiac data
    for video_id, cardiac in sorted(cardiac_data.items()):
        ts_content += f"  '{video_id}': {{ ef: {cardiac['ef']}, esv: {cardiac['esv']}, edv: {cardiac['edv']} }},\n"
    
    ts_content += "};\n"
    
    # Write to videoData.ts
    with open('src/lib/videoData.ts', 'w') as f:
        f.write(ts_content)
    
    # Summary
    common_videos = set(frame_data.keys()) & set(cardiac_data.keys())
    print(f"\n📊 SUMMARY:")
    print(f"   • Frame data: {len(frame_data)} videos")
    print(f"   • Cardiac data: {len(cardiac_data)} videos")
    print(f"   • Complete data (both): {len(common_videos)} videos")
    print(f"   • videoData.ts updated successfully! ✅")
    
    # Check the specific video mentioned
    target_video = "0X4724EF4A6021488E.mp4"
    if target_video in frame_data:
        print(f"\n🎯 {target_video}:")
        print(f"   • Frame data: ES={frame_data[target_video]['es']}, ED={frame_data[target_video]['ed']}")
    else:
        print(f"\n❌ {target_video} missing from frame data")
        
    if target_video in cardiac_data:
        print(f"   • Cardiac data: EF={cardiac_data[target_video]['ef']}, ESV={cardiac_data[target_video]['esv']}, EDV={cardiac_data[target_video]['edv']}")
    else:
        print(f"   • ❌ {target_video} missing from cardiac data")

if __name__ == "__main__":
    create_complete_video_data()
