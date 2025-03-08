import qrcode
from PIL import Image
import os

def generate_qr_code(url, output_path="qrcode.png", box_size=10, border=4, fill_color="black", back_color="white"):
    """
    Generate a QR code from a URL
    
    Parameters:
    - url: The URL to encode in the QR code
    - output_path: Path where the QR code image will be saved
    - box_size: Size of each box in the QR code
    - border: Border size of the QR code
    - fill_color: Color of the QR code data
    - back_color: Background color
    
    Returns:
    - Path to the generated QR code image
    """
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=box_size,
        border=border
    )
    
    # Add data to the QR code
    qr.add_data(url)
    qr.make(fit=True)
    
    # Create an image from the QR code
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    
    # Save the image
    img.save(output_path)
    
    return output_path

if __name__ == "__main__":
    # Example usage
    url = input("Enter the URL to encode in QR code: ")
    output_file = input("Enter output filename (default: qrcode.png): ") or "qrcode.png"
    
    qr_path = generate_qr_code(url, output_path=output_file)
    print(f"QR code generated and saved to {qr_path}")
