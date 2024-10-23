# kafk-nestjs-1

Este proyecto contiene la implementación de Kafka utilizando la librería kafkajs.

## Descripción

La problemática que busca resolver este proyecto es la de implementar un microservicio o proyecto en NestJS que pueda mantenerse escuchando mensajes que lleguen a una "n" cantidad de tópicos (topics) y procesarlos. Además, producir mensajes bajo demanda según sea necesario. Todo esto sin la necesidad específica de consumir un servicio expuesto dentro del proyecto.

Adicional a lo anterior, también se busca implementar kafka de tal manera que sea completamente configurable desde un servidor externo, así evitar exponer configuraciones sensibles, como el broker de kafka, nombres de topics o cualquier configuración relacionada a la aplicación. Para esto la implementación se basa en el uso del patrón de diseño "builder" y un servidor externo que almacene las configuraciones necesarias.

## Requisitos

- Node.js 20 o superior
- npm (Node Package Manager)
- volta (opcional)

## Instalación

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm i
```

## Ejecución

Ejecuta el siguiente comando para arrancar el proyecto en local

```bash
npm run start:dev
```