<?php
namespace App\DTO;

class EmailDTO
{
    public $to;
    public $subject;
    public $templateVars;

    public function __construct(array $data)
    {
        $this->to = $data['to'] ?? '';
        $this->subject = $data['subject'] ?? '';
        $this->templateVars = $data['templateVars'] ?? [];
    }
}
