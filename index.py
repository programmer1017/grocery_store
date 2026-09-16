from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # مثال للمنتجات الممررة للواجهة
    products = [
        {"id": 1, "name": "عصير برتقال طازج", "category": "مشروبات", "price": 8.5, "in_stock": True, "image_url": ""},
        {"id": 2, "name": "رقائق شيبس بالملح", "category": "تسالي", "price": 3.0, "in_stock": True, "image_url": ""},
    ]
    return render_template('index.html', products=products, cart={}, total_price=0)
