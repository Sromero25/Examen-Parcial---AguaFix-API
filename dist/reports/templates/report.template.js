"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportTemplate = void 0;
const generateReportTemplate = (dto) => {
    return `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #0056b3;">💧 Nuevo Reporte de Fuga de Agua</h2>
      <p>El sistema ha registrado un nuevo incidente en la vía pública:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc; background-color: #f8f9fa;"><strong>Dirección:</strong></td>
          <td style="padding: 10px; border: 1px solid #ccc;">${dto.address}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc; background-color: #f8f9fa;"><strong>Descripción:</strong></td>
          <td style="padding: 10px; border: 1px solid #ccc;">${dto.description}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc; background-color: #f8f9fa;"><strong>Severidad:</strong></td>
          <td style="padding: 10px; border: 1px solid #ccc; color: ${dto.severity === 'high' ? 'red' : dto.severity === 'medium' ? '#ff9900' : 'green'};">
            <strong>${dto.severity.toUpperCase()}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc; background-color: #f8f9fa;"><strong>Tel. Contacto:</strong></td>
          <td style="padding: 10px; border: 1px solid #ccc;">${dto.reporterPhone}</td>
        </tr>
      </table>
      
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Por favor, asigne una cuadrilla lo antes posible.
      </p>
    </div>
  `;
};
exports.generateReportTemplate = generateReportTemplate;
//# sourceMappingURL=report.template.js.map