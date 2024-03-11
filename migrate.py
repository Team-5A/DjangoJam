import os

if os.path.exists("db.sqlite3"):
    os.remove("db.sqlite3")

os.system("python manage.py makemigrations django_jam_app")
os.system("python manage.py migrate")
os.system("python manage.py createsuperuser --username admin --email admin@admin.co.uk")

os.system("python population_script.py")

