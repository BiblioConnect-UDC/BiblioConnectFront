import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LibroService } from '../../services/libro.service';
import { EditorialService } from '../../services/editorial.service';
import { GeneroService } from '../../services/genero.service';
import { CreateLibroRequest, EditorialEntity, Genero, LibroCompleto } from '../../models/libro.models';

@Component({
  selector: 'app-libro-form',
  templateUrl: './libro-form.component.html',
  styleUrls: ['./libro-form.component.css']
})
export class LibroFormComponent implements OnInit {
  libroForm: FormGroup;
  editoriales: EditorialEntity[] = [];
  generos: Genero[] = [];
  loading: boolean = false;
  modoEdicion: boolean = false;
  libroId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private libroService: LibroService,
    private editorialService: EditorialService,
    private generoService: GeneroService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.libroForm = this.formBuilder.group({
     
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      isbn: ['', [Validators.required, Validators.maxLength(50)]],
      idEditorial: [null, Validators.required],
      idCategoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarEditoriales();
    this.cargarGeneros();
    
    // Verificar si es modo edición
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.libroId = +params['id'];
        this.cargarLibro(this.libroId);
      }
    });
  }

  obtenerNombreEditorial(): string {
    const idEditorial = this.libroForm.get('idEditorial')?.value;
    if (!idEditorial) return '';
    const editorial = this.editoriales.find(e => e.id === idEditorial);
    return editorial?.nombre || '';
  }

  obtenerNombreGenero(): string {
    const idGenero = this.libroForm.get('idCategoria')?.value;
    if (!idGenero) return '';
    const genero = this.generos.find(g => g.id === idGenero);
    return genero?.nombre || '';
  }


  cargarEditoriales(): void {
    this.editorialService.getAllEditorials().subscribe({
      next: (editoriales) => {
        this.editoriales = editoriales;
        console.log('Editoriales cargadas:', editoriales.length);
      },
      error: (error) => {
        console.error('Error al cargar editoriales:', error);
        alert('Error al cargar las editoriales.');
      }
    });
  }

  cargarGeneros(): void {
    this.generoService.getAllGeneros().subscribe({
      next: (generos) => {
        this.generos = generos;
        console.log('Géneros cargados:', generos.length);
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        alert('Error al cargar los géneros.');
      }
    });
  }

  cargarLibro(id: number): void {
    this.loading = true;
    this.libroService.getBookById(id).subscribe({
      next: (libro: LibroCompleto) => {

      console.log('Libro recibido del backend:', libro); 
      console.log('Estructura completa:', JSON.stringify(libro, null, 2));
        this.libroForm.patchValue({
          
          titulo: libro.titulo,
          isbn: libro.isbn,
          idEditorial: libro.idEditorial,
          idCategoria: libro.idGenero // Nota: el backend usa idGenero en lugar de idCategoria
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar libro:', error);
        alert('Error al cargar el libro');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  guardarLibro(): void {
    if (this.libroForm.invalid) {
      Object.keys(this.libroForm.controls).forEach(key => {
        const control = this.libroForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.loading = true;
    const libroData: CreateLibroRequest = {
      titulo: this.libroForm.get('titulo')?.value,
      isbn: this.libroForm.get('isbn')?.value,
      idEditorial: this.libroForm.get('idEditorial')?.value,
      idCategoria: this.libroForm.get('idCategoria')?.value,
      estado: 'ACTIVO' // Por defecto activo
    };

    if (this.modoEdicion && this.libroId) {
      // Actualizar libro existente
      this.libroService.updateBook(this.libroId, libroData).subscribe({
        next: (libroActualizado) => {
          console.log('Libro actualizado:', libroActualizado);
          alert('✓ Libro actualizado exitosamente');
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('✗ Error al actualizar el libro: ' + (error.error?.message || error.message || 'Error desconocido'));
          this.loading = false;
        }
      });
    } else {
      // Crear nuevo libro
      this.libroService.createBook(libroData).subscribe({
        next: (libroCreado) => {
          console.log('Libro creado:', libroCreado);
          alert('Libro creado exitosamente');
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          alert('Error al crear el libro: ' + (error.error?.message || error.message || 'Error desconocido'));
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/home']);
    }
  }

  limpiarFormulario(): void {
    this.libroForm.reset();
  }
}