/**
 * Gera PDF a partir de elemento HTML
 */
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const generatePdfFromElement = async (
  element: HTMLElement,
  filename: string = 'documento.pdf'
): Promise<void> => {
  try {
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}

/**
 * Gera relatório em CSV
 */
export const generateCSV = (
  data: Record<string, any>[],
  filename: string = 'relatorio.csv'
): void => {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map((row) => headers.map((header) => row[header]).join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
