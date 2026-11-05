import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index
} from 'typeorm';
import { EstudiantePerfil } from './EstudiantePerfil.entity';
import { Asignacion } from './Asignacion.entity';
import { RegistroActividad } from './RegistroActividad.entity';
import { NotificacionDocente } from './NotificacionDocente.entity';
import { ConversacionLumy } from './ConversacionLumy.entity';

export enum RolUsuario {
  DOCENTE = 'docente',
  ALUMNO = 'alumno',
  ADMIN = 'admin'
}

/**
 * Entidad de Usuario con diseño de Privacidad por Defecto (Privacy by Design).
 * Para los alumnos menores de edad (COPPA/FERPA/GDPR-K):
 * - No se requiere ni almacena correo del menor.
 * - Autenticación mediante Alias único y hash de PIN (numérico y visual).
 * - El correo del padre/tutor se almacena exclusivamente para consentimientos parentales y reportes.
 */
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.ALUMNO
  })
  rol!: RolUsuario;

  /**
   * Alias público y amigable para el menor (ej. "estrella_veloz", "ana_g").
   * Garantiza la anonimización de menores sin revelar apellidos ni identidad civil.
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 60 })
  alias!: string;

  /**
   * Nombre real o código cifrado opcional. Para alumnos se recomienda solo primer nombre.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  nombreVisible?: string;

  /**
   * Solo para docentes: Correo institucional/personal de acceso.
   * Los alumnos NUNCA tienen email propio en el sistema.
   */
  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  emailDocente?: string;

  /**
   * Hash seguro de contraseña (para docentes: bcrypt/argon2) o hash de PIN (para alumnos).
   */
  @Column({ type: 'varchar', length: 255 })
  credencialHash!: string;

  /**
   * Secuencia de iconos del PIN Visual para menores de 6-12 años
   * Permite inicio de sesión visual intuitivo sin requerir lectoescritura avanzada.
   * Ejemplo: ['cohete', 'estrella', 'manzana', 'delfin']
   */
  @Column({ type: 'simple-array', nullable: true })
  pinVisualIconos?: string[];

  /**
   * Correo electrónico verificado del padre, madre o tutor legal del menor.
   * Se utiliza para notificaciones de progreso y consentimientos informados.
   */
  @Column({ type: 'varchar', length: 150, nullable: true })
  correoTutorParental?: string;

  @Column({ type: 'boolean', default: false })
  consentimientoParentalVerificado!: boolean;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  /**
   * Relación 1:1 con el perfil de gamificación y preferencias de accesibilidad del alumno
   */
  @OneToOne(() => EstudiantePerfil, (perfil) => perfil.usuario, { cascade: true })
  perfilEstudiante?: EstudiantePerfil;

  /**
   * Asignaciones creadas por el docente o recibidas por el alumno
   */
  @OneToMany(() => Asignacion, (asig) => asig.docenteCreador)
  asignacionesCreadas?: Asignacion[];

  @OneToMany(() => Asignacion, (asig) => asig.estudianteAsignado)
  asignacionesRecibidas?: Asignacion[];

  /**
   * Registros de juego y telemetría de aprendizaje
   */
  @OneToMany(() => RegistroActividad, (reg) => reg.estudiante)
  registrosActividad?: RegistroActividad[];

  /**
   * Sesiones e interacciones con el tutor inteligente Lumy
   */
  @OneToMany(() => ConversacionLumy, (conv) => conv.estudiante)
  conversacionesLumy?: ConversacionLumy[];

  /**
   * Notificaciones y alertas recibidas por el docente
   */
  @OneToMany(() => NotificacionDocente, (notif) => notif.docente)
  notificacionesRecibidas?: NotificacionDocente[];

  @CreateDateColumn()
  fechaRegistro!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
}
