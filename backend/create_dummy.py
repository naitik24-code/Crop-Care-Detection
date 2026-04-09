import os, cv2, numpy as np

def create_dummy_images():
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dataset', 'plant_village'))
    
    for i, cls in enumerate(['Apple___Apple_scab', 'Apple___healthy']):
        class_path = os.path.join(base_path, cls)
        os.makedirs(class_path, exist_ok=True)
        for j in range(5):  # 5 images per class
            img = np.full((224, 224, 3), (i+1)*50 + j, dtype=np.uint8) 
            img_path = os.path.join(class_path, f'dummy_{j}.jpg')
            cv2.imwrite(img_path, img)
            print('Dummy image created at', img_path)

if __name__ == '__main__':
    create_dummy_images()
