from jinja2 import Environment, FileSystemLoader
import os 

def render_template(data):
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Define the path to the directory containing the template file
    template_directory = os.path.join(current_directory, 'templates')

    # Create a Jinja2 environment and load the template file
    env = Environment(loader=FileSystemLoader(template_directory))
    template = env.get_template('django_jam_app/render_template.html')

    # Render the template with the provided data
    rendered_content = template.render(my_list=data)

    return rendered_content

if __name__ == "__main__":
    # Example list data
    notes = [
        "C3", "C#3/Db3", "D3", "D#3/Eb3", "E3", "F3", "F#3/Gb3", "G3", "G#3/Ab3", "A3", "A#3/Bb3", "B3",
        "C4", "C#4/Db4", "D4", "D#4/Eb4", "E4", "F4", "F#4/Gb4", "G4", "G#4/Ab4", "A4", "A#4/Bb4", "B4",
        "C5",
        "Rest"
    ]
    # Render the template with the list data
    html_content = render_template(notes)

    # Output the rendered HTML content
    print(html_content)