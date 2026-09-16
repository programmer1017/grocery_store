from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # مثال لبيانات المنتجات
    products = [
        {'id': 1, 'name': 'حليب طازج 1 ليتر', 'category': 'ألبان', 'price': 6.5, 'in_stock': True, 'image_url': 'https://via.placeholder.com/200'},
        {'id': 2, 'name': 'خبز أبيض', 'category': 'مخبوزات', 'price': 1.0, 'in_stock': True, 'image_url': 'https://via.placeholder.com/200'},
    ]
    cart = {}
    total_price = 0
    return render_template('index.html', products=products, cart=cart, total_price=total_price)

if __name__ == '__main__':
    app.run(debug=True)
