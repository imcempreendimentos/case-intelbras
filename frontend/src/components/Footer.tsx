export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-medium-gray">
          <p>© Copyright Intelbras {currentYear}. Todos os direitos reservados.</p>
          <p>Gerenciador de Dispositivos v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
