**Avance 15-06-2026 - Fase 1**

Completado:
- Las solicitudes autenticadas se serializan para respetar la rotación de tokens del backend.
- La persistencia de tokens queda centralizada en el interceptor de Axios.
- Una falla de red o un error 5xx durante la hidratación ya no cierra la sesión.
- Los errores 401, 403 y mensajes de JWT/token inválido sí cierran la sesión.
- El logout elimina la cotización persistida.
- `QuoteProvider` limpia también su estado en memoria al cerrar sesión y solo hidrata datos con una cuenta autenticada.
- Axios tiene timeout global de 30 segundos y fue actualizado de 1.7.9 a 1.18.0.
- Se aplicaron los parches compatibles recomendados para Expo SDK 54.
- Se agregaron pruebas para clasificación de errores de autenticación y limpieza del storage de cotización.

Validación:
- TypeScript: sin errores.
- ESLint: 0 errores, 49 advertencias preexistentes.
- Jest: 2 suites, 6 pruebas aprobadas.
- Expo Doctor: 18/18 verificaciones aprobadas.

Pendiente de la fase 1:
- El backend no expone actualmente `/auth/verify-session`; no es posible validar la sesión remotamente al arrancar.
- Falta definir una política central para 401/403 fuera del flujo de hidratación.

**Avance 15-06-2026 - Fase 2**

Completado:
- Se eliminó el QR ficticio, el enlace a BCI y los datos personales/fechas hardcodeados.
- La pantalla final ahora confirma vehículo, propietario y plan con datos reales antes de enviar la cotización.
- La generación de transacción está protegida contra doble toque y llamadas simultáneas.
- Una transacción exitosa limpia el estado activo de cotización.
- Las cotizaciones `Pendiente` ya no permiten generar nuevamente la transacción.
- El ingreso manual actualiza correctamente `brand` y `model`.
- El historial busca por propietario, comprador, marca, modelo y patente.
- El filtro de fecha final incluye el día completo.
- Un cotizante inexistente muestra un estado recuperable en vez de cargar indefinidamente.
- Se eliminó la dependencia `react-native-qrcode-svg`.

Validación:
- TypeScript: sin errores.
- ESLint: 0 errores, 43 advertencias preexistentes.
- Jest: 3 suites, 9 pruebas aprobadas.
- Expo Doctor: 18/18 verificaciones aprobadas.

Pendiente de la fase 2:
- Reanudar cotizaciones continúa dependiendo de estados generales hasta que el backend entregue el paso exacto.
- La fecha de próximo pago sigue siendo una estimación local y debe provenir del backend.
- Si en el futuro existe un enlace real de contratación, debe incorporarse como dato explícito de la API.

**Evaluación**
La app está en un estado de **beta funcional avanzada**, pero todavía no la consideraría lista para producción financiera.

**Hallazgos Críticos**
1. **Carrera en la rotación de tokens.** Cada respuesta puede guardar tokens desde el interceptor y algunos providers vuelven a guardarlos. Dos solicitudes simultáneas podrían sobrescribir tokens nuevos con una respuesta anterior. [token.interceptor.ts](D:/Connect360/Referidos-App/v5/ReferidosApp/core/services/api/interceptors/token.interceptor.ts:27)

2. **Una falla temporal de red cierra la sesión.** Cualquier error durante la hidratación ejecuta `logout()`, aunque no sea un JWT inválido. [UserProvider.tsx](D:/Connect360/Referidos-App/v5/ReferidosApp/core/context/user/UserProvider.tsx:64)

3. **La cotización persiste entre usuarios.** El logout limpia autenticación, usuario y sesión, pero no `STORAGE_KEYS.QUOTE`. Una cuenta nueva podría recibir vehículo, planes o `quoterId` de la anterior. [AuthProvider.tsx](D:/Connect360/Referidos-App/v5/ReferidosApp/core/context/auth/AuthProvider.tsx:125)

4. **La pantalla final todavía contiene información ficticia.** Usa `https://bci.cl/id=...`, “Alejandro Osses” y fechas de 2024. Esto no puede permanecer en producción. [payment-qr.tsx](D:/Connect360/Referidos-App/v5/ReferidosApp/app/(quote)/payment-qr.tsx:30)

5. **Ciudad y comuna son obligatorias en el frontend, pero el backend no las conserva.** Además, el catálogo actual realmente contiene provincia y comuna. Debe quedar bloqueado hasta que Eliu implemente Región/Comuna.

**Riesgos Altos**
- Axios no tiene timeout global: una solicitud puede quedar esperando indefinidamente. [config.ts](D:/Connect360/Referidos-App/v5/ReferidosApp/core/services/api/config.ts:8)
- La cotización consulta aseguradoras secuencialmente. Con cinco aseguradoras y 30 segundos por cada una, podría tardar 150 segundos. El timeout actual tampoco cancela la petición original.
- La app confía en que tener tokens almacenados equivale a una sesión válida. `verifySession()` existe, pero no se utiliza al arrancar.
- No hay recuperación centralizada para `401`, `403` o JWT inválido.
- Generar transacción no tiene protección visible contra doble toque o reintento.
- El bloqueo biométrico solo se aplica al iniciar; al volver desde segundo plano puede quedar desbloqueada.
- El PIN permite intentos ilimitados.
- `axios@1.7.9` aparece vulnerable en `npm audit` y debe actualizarse de forma controlada.

**Flujos Incompletos**
- “Ver pago” calcula localmente el próximo día 15. No proviene del backend. [withdrawal.tsx](D:/Connect360/Referidos-App/v5/ReferidosApp/app/(wallet)/withdrawal.tsx:23)
- Existen botones y callbacks bancarios sin implementación.
- El QR no tiene sentido mientras no exista un enlace real de contratación.
- Reanudar cotizaciones depende de inferir el paso desde estados generales; falta un endpoint que informe exactamente el paso pendiente.
- El ingreso manual actualiza accidentalmente `marca` y `modelo` en lugar de `brand` y `model`. [manual-search.tsx](D:/Connect360/Referidos-App/v5/ReferidosApp/app/(quote)/manual-search.tsx:181)
- El buscador de cotizantes dice “Buscar por nombre”, pero solo busca marca, modelo y patente.
- El filtro “Hasta” puede excluir registros del mismo día después de medianoche.
- Un cotizante inexistente deja la pantalla de detalle cargando indefinidamente.

**Calidad**
- TypeScript: correcto.
- ESLint: 0 errores, 49 advertencias.
- Exportación Android de producción: correcta.
- Expo Doctor: 6 paquetes con parches pendientes.
- Pruebas: ninguna.
- Accesibilidad: no encontré labels, roles ni estados accesibles.
- Observabilidad: no hay Crashlytics/Sentry ni registro controlado de errores.
- Hay aproximadamente 70 usos de `any` o casts equivalentes en contratos API.

**Orden Recomendado**
1. Corregir ciclo de tokens, concurrencia, logout y estado por usuario.
2. Eliminar datos ficticios y definir el término real del flujo.
3. Acordar con Eliu Región/Comuna, estados y reanudación.
4. Actualizar Axios y parches de Expo.
5. Agregar pruebas de autenticación, cotización, plan, transacción y pagos.
6. Incorporar monitoreo, accesibilidad, paginación y estados offline.
