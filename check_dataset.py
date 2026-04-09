import os
import sys

# Paths
BACKEND_DIR = os.path.abspath("backend")
DATASET_PATH = os.path.join(BACKEND_DIR, "dataset" , "PlantVillage")

sys.path.append(BACKEND_DIR)
from data_loader import print_dataset_summary

print(f"Checking dataset at: {DATASET_PATH}")
if os.path.exists(DATASET_PATH):
    print_dataset_summary(DATASET_PATH)
else:
    print("Dataset path does not exist!")
